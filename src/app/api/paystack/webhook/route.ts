import { NextRequest, NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";
import { verifyWebhookSignature, verifyTransaction } from "@/lib/paystack";

/**
 * Paystack webhook receiver for wallet funding via bank transfer.
 *
 * Configure this URL (`https://<your-domain>/api/paystack/webhook`) in the
 * Paystack dashboard under Settings → API Keys & Webhooks, using the same
 * **test mode** secret key as `PAYSTACK_SECRET_KEY` during development.
 *
 * On a verified `charge.success` event, this looks up the pending
 * transaction created in `fundWalletAction` (by its `paystackReference`)
 * and credits the wallet — mirroring the crediting logic that the simulated
 * `ussd` / `cash_agent` methods still do inline.
 */
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: { event?: string; data?: { reference?: string } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (event.event !== "charge.success") {
    // Acknowledge everything else so Paystack doesn't keep retrying.
    return NextResponse.json({ received: true });
  }

  const reference = event.data?.reference;
  if (!reference) {
    return NextResponse.json({ error: "Missing reference" }, { status: 400 });
  }

  const db = await readDb();
  const txn = db.transactions.find(
    (t) => t.paystackReference === reference && t.status === "pending"
  );
  if (!txn) {
    // Either already processed, or not one of ours — acknowledge either way
    // so Paystack stops retrying.
    return NextResponse.json({ received: true, note: "No matching pending transaction" });
  }

  // Never trust the webhook payload's amount directly — re-verify the
  // transaction against Paystack's API before crediting anything.
  const verification = await verifyTransaction(reference);
  if (!verification.success) {
    return NextResponse.json({ error: verification.error }, { status: 422 });
  }

  const wallet = db.wallets.find((w) => w.userId === txn.userId);
  if (!wallet) {
    return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
  }

  wallet.balanceNgn += verification.amountNgn;
  txn.status = "completed";
  // Reconcile in case Paystack's verified amount differs from the initiated
  // amount for any reason (e.g. the customer paid a rounded amount).
  txn.amountNgn = verification.amountNgn;
  txn.note = `Confirmed via Paystack webhook (ref: ${reference})`;

  await writeDb(db);

  return NextResponse.json({ received: true });
}
