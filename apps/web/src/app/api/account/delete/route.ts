import { NextResponse, type NextRequest } from "next/server";
import { track } from "@/lib/analytics";
import { bearerUser } from "@/lib/auth";
import { deleteAccount } from "@/lib/billing";
import { emails, sendEmail } from "@/lib/email";

/**
 * Account deletion for the mobile app (Apple and Google require it in-app), with the
 * Supabase access token as "Authorization: Bearer …". The web uses the Account page.
 */
export async function POST(request: NextRequest) {
  const user = await bearerUser(request.headers.get("authorization"));
  if (!user) return NextResponse.json({ error: "not signed in" }, { status: 401 });
  try {
    await deleteAccount(user.id);
  } catch (error) {
    console.error("account deletion failed:", error);
    return NextResponse.json({ error: "Deleting the account failed. Try again, or contact us." }, { status: 500 });
  }
  await track(user.id, "account_deleted", { from: "mobile" });
  if (user.email) {
    const { subject, text } = emails.accountDeleted();
    await sendEmail(user.email, subject, text);
  }
  return NextResponse.json({ ok: true });
}
