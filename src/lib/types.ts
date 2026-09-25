export type User = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  nin: string;
  passwordHash: string;
  kycTier: 1 | 2 | 3;
  createdAt: string;
};

export type Wallet = {
  userId: string;
  balanceNgn: number;
};

export type TransactionType =
  | "fund"
  | "p2p_send"
  | "p2p_receive"
  | "remit_send"
  | "remit_receive"
  | "agent_cash_in"
  | "agent_cash_out"
  | "card_fund"
  | "card_spend";

export type TransactionStatus = "completed" | "pending" | "locked";

export type Transaction = {
  id: string;
  userId: string;
  type: TransactionType;
  amountNgn: number;
  counterpartyName?: string;
  counterpartyPhone?: string;
  method?: string;
  note?: string;
  fxRate?: number;
  sourceCurrency?: string;
  sourceAmount?: number;
  feeNgn?: number;
  status: TransactionStatus;
  createdAt: string;
  /** Paystack transaction reference, set for bank-transfer funding attempts
   * initiated via Paystack so the webhook can look the pending record up. */
  paystackReference?: string;
  /** Merchant name for a simulated card_spend (e.g. "Amazon", "eBay", or a
   * free-text "Other" merchant). */
  merchant?: string;
};

export type Agent = {
  id: string;
  name: string;
  city: "Lagos" | "Abuja";
  area: string;
  type: "cash_in_out" | "wifi_hotspot" | "both";
  rating: number;
  commissionPct: number;
};

export type Card = {
  id: string;
  userId: string;
  last4: string;
  cardholderName: string;
  expiryMonth: number;
  expiryYear: number;
  balanceUsd: number;
  status: "active" | "frozen";
  createdAt: string;
};

export type DB = {
  users: User[];
  wallets: Wallet[];
  transactions: Transaction[];
  agents: Agent[];
  cards: Card[];
};
