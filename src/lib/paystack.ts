// Thin wrappers around Paystack's REST API (test/sandbox mode).
//
// These are plain `fetch` calls against Paystack's documented Transaction
// Initialize / Verify endpoints — no SDK required. Every function reads its
// credentials from `process.env` at call time (never hardcoded) and returns
// a typed error object instead of throwing when a required key is missing,
// so the app builds and runs fine in an environment with no Paystack keys
// configured yet.
//
// Use Paystack **test mode** secret/public keys (they start with `sk_test_`
// / `pk_test_`) during development. Switching to live keys is a "going
// live" decision — see COMPLIANCE.md before ever doing that.

import crypto from "node:crypto";

const PAYSTACK_BASE_URL = "https://api.paystack.co";

function getSecretKey(): string | null {
  return process.env.PAYSTACK_SECRET_KEY || null;
}

export function getPublicKey(): string | null {
  return process.env.PAYSTACK_PUBLIC_KEY || null;
}

type InitializeTransactionResult =
  | { authorizationUrl: string; reference: string }
  | { error: string };

/**
 * Calls Paystack's `/transaction/initialize` endpoint to start a bank
 * transfer / card charge, returning the hosted checkout URL to redirect
 * the customer to.
 */
export async function initializeTransaction({
  email,
  amountNgn,
  reference,
  callbackUrl,
}: {
  email: string;
  amountNgn: number;
  reference: string;
  callbackUrl?: string;
}): Promise<InitializeTransactionResult> {
  const secretKey = getSecretKey();
  if (!secretKey) {
    return {
      error:
        "Payment provider is not configured. Set PAYSTACK_SECRET_KEY (a Paystack test secret key) to enable bank transfer funding.",
    };
  }

  try {
    const res = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: Math.round(amountNgn * 100), // Paystack expects kobo
        reference,
        channels: ["bank_transfer"],
        ...(callbackUrl ? { callback_url: callbackUrl } : {}),
      }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.status) {
      return { error: data?.message ?? `Paystack initialize failed (HTTP ${res.status})` };
    }

    const authorizationUrl = data.data?.authorization_url;
    const returnedReference = data.data?.reference ?? reference;
    if (!authorizationUrl) {
      return { error: "Paystack did not return an authorization URL" };
    }

    return { authorizationUrl, reference: returnedReference };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to reach Paystack" };
  }
}

type VerifyTransactionResult =
  | { success: true; amountNgn: number }
  | { success: false; error: string };

/**
 * Calls Paystack's `/transaction/verify/:reference` endpoint to confirm a
 * transaction actually succeeded before crediting anything.
 */
export async function verifyTransaction(reference: string): Promise<VerifyTransactionResult> {
  const secretKey = getSecretKey();
  if (!secretKey) {
    return { success: false, error: "PAYSTACK_SECRET_KEY is not configured" };
  }

  try {
    const res = await fetch(
      `${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: { Authorization: `Bearer ${secretKey}` },
      }
    );

    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.status) {
      return { success: false, error: data?.message ?? `Paystack verify failed (HTTP ${res.status})` };
    }

    if (data.data?.status !== "success") {
      return { success: false, error: `Transaction status: ${data.data?.status ?? "unknown"}` };
    }

    const amountNgn = (data.data?.amount ?? 0) / 100;
    return { success: true, amountNgn };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to reach Paystack" };
  }
}

/**
 * Verifies Paystack's `x-paystack-signature` webhook header: HMAC-SHA512 of
 * the raw request body, keyed with the Paystack secret key, per Paystack's
 * documented webhook verification scheme.
 */
export function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  const secretKey = getSecretKey();
  if (!secretKey || !signature) return false;

  const hash = crypto.createHmac("sha512", secretKey).update(rawBody).digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(signature));
  } catch {
    return false;
  }
}
