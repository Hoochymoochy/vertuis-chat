const API_BASE = "https://veritus-payment.vercel.app/api/billing";

/**
 * CREATE: Start a new subscription (redirects to Stripe Checkout)
 */
export async function createPlan(
  plan: "student" | "pro",
  userId: string,
  email: string,
  name: string,
  isPtBr: boolean,
  locale: string
) {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      plan,
      userId,
      email,
      name,
      currency: isPtBr ? "brl" : "usd",
      locale,
    }),
  });

  if (!res.ok) throw new Error("Failed to create plan");
  return res.json(); // { url }
}

/**
 * READ: Get active subscription for user
 */
export async function readPlan(userId: string) {
  const res = await fetch(`${API_BASE}/${userId}`, {
    method: "GET",
  });

  if (!res.ok) return null;
  return res.json();
}

/**
 * UPDATE: Change subscription plan
 */
export async function updatePlan(
  subscriptionId: string,
  newPlan: "student" | "pro",
  currency: "usd" | "brl"
) {
  const res = await fetch(`${API_BASE}/update`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      subscriptionId,
      newPlan,
      currency,
    }),
  });

  if (!res.ok) throw new Error("Failed to update plan");
  return res.json();
}

/**
 * CANCEL: Cancel subscription immediately
 */
export async function cancelPlan(subscriptionId: string) {
  const res = await fetch(`${API_BASE}/cancel`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subscriptionId }),
  });

  if (!res.ok) throw new Error("Failed to cancel plan");
  return res.json();
}
