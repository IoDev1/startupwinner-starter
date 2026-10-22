-- Starter schema: a profile per person, their Stripe customer and subscriptions.
-- Row-level security everywhere: people read their own rows; only the server
-- (service role: Stripe webhook, account deletion) writes billing rows.
-- Deleting the auth user deletes everything below (on delete cascade).

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default now()
);

create table public.customers (
  user_id uuid primary key references auth.users (id) on delete cascade,
  stripe_customer_id text not null unique
);

create table public.subscriptions (
  id text primary key,                       -- Stripe subscription id
  user_id uuid not null references auth.users (id) on delete cascade,
  status text not null,                      -- active, trialing, past_due, canceled, …
  price_id text,
  cancel_at_period_end boolean not null default false,
  updated_at timestamptz not null default now()
);
create index subscriptions_user_id on public.subscriptions (user_id);

alter table public.profiles enable row level security;
alter table public.customers enable row level security;
alter table public.subscriptions enable row level security;

create policy "read own profile" on public.profiles for select to authenticated using ((select auth.uid()) = id);
create policy "update own profile" on public.profiles for update to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "read own customer" on public.customers for select to authenticated using ((select auth.uid()) = user_id);
create policy "read own subscriptions" on public.subscriptions for select to authenticated using ((select auth.uid()) = user_id);

-- A profile for every new account.
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();
