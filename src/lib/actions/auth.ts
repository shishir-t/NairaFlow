"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { readDb, writeDb, genId } from "@/lib/db";
import { createSession, destroySession } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import type { FormState } from "@/lib/actions/state";

const signupSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name"),
  email: z.string().trim().email("Enter a valid email"),
  phone: z
    .string()
    .trim()
    .regex(/^0[789][01]\d{8}$/, "Enter a valid Nigerian phone number (e.g. 08012345678)"),
  nin: z.string().trim().regex(/^\d{11}$/, "NIN must be 11 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function signupAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = signupSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    nin: formData.get("nin"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { fullName, email, phone, nin, password } = parsed.data;

  const ip = await getClientIp();
  const rateLimit = checkRateLimit(`signup:${email.toLowerCase()}:${ip}`);
  if (!rateLimit.allowed) {
    return { error: "Too many signup attempts. Please try again in a minute." };
  }

  const db = readDb();

  if (db.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return { error: "An account with this email already exists" };
  }
  if (db.users.some((u) => u.phone === phone)) {
    return { error: "An account with this phone number already exists" };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const userId = genId("usr");

  db.users.push({
    id: userId,
    fullName,
    email,
    phone,
    nin,
    passwordHash,
    kycTier: 1,
    createdAt: new Date().toISOString(),
  });
  db.wallets.push({ userId, balanceNgn: 0 });
  writeDb(db);

  await createSession(userId);
  redirect("/dashboard");
}

const loginSchema = z.object({
  identifier: z.string().trim().min(3, "Enter your email or phone"),
  password: z.string().min(1, "Enter your password"),
});

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse({
    identifier: formData.get("identifier"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { identifier, password } = parsed.data;

  const ip = await getClientIp();
  const rateLimit = checkRateLimit(`login:${identifier.toLowerCase()}:${ip}`);
  if (!rateLimit.allowed) {
    return { error: "Too many login attempts. Please try again in a minute." };
  }

  const db = readDb();
  const user = db.users.find(
    (u) => u.email.toLowerCase() === identifier.toLowerCase() || u.phone === identifier
  );
  if (!user) return { error: "No account found with that email or phone" };

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return { error: "Incorrect password" };

  await createSession(user.id);
  redirect("/dashboard");
}

export async function logoutAction() {
  await destroySession();
  redirect("/");
}
