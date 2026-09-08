/**
 * Admin user store + password verification (bcrypt).
 * Users live in the `admin_users` collection: { email, passwordHash }.
 * Seed one with scripts/seed-admin.mts.
 */

import bcrypt from "bcryptjs";
import { getDb } from "@/lib/leads";

export interface AdminUser {
  email: string;
  passwordHash: string;
}

/** True only when the email exists and the password matches the stored hash. */
export async function verifyAdmin(email: string, password: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  const user = await db.collection<AdminUser>("admin_users").findOne({ email: email.toLowerCase().trim() });
  if (!user?.passwordHash) return false;
  try {
    return await bcrypt.compare(password, user.passwordHash);
  } catch {
    return false;
  }
}
