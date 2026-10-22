// Your product in one place: the landing page, the pricing card, emails and legal pages read this.

export const site = {
  name: "My App",
  promise: "The one sentence that says what people get",
  description: "Two lines on who it's for and why it's better than what they use today.",
  // Shown on the legal pages and in emails.
  company: "My Company",
  contactEmail: "hello@example.com",
  features: [
    { title: "First feature", text: "What it does for the person, not how it works." },
    { title: "Second feature", text: "Keep the MVP to five features; list them in README.md." },
    { title: "Third feature", text: "The reason to pay for Pro." },
  ],
  pricing: {
    free: { name: "Free", price: "$0", points: ["The core flow", "Up to 3 things"] },
    pro: { name: "Pro", price: "$8/mo", points: ["Everything in Free", "Unlimited things", "Priority support"] },
  },
};

/** The public address, for links in emails and Stripe redirects. */
export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");
}
