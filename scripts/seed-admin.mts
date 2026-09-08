/**
 * Seed / update an admin user (bcrypt-hashed password) in the `admin_users`
 * collection. Idempotent — re-running with the same email updates the password.
 *
 * Usage:
 *   node --env-file=.env.local --experimental-strip-types scripts/seed-admin.mts <email> <password>
 */

import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const [, , emailArg, passwordArg] = process.argv;

if (!emailArg || !passwordArg) {
  console.error("Usage: seed-admin.mts <email> <password>");
  process.exit(1);
}
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is not set (pass --env-file=.env.local).");
  process.exit(1);
}

const email = emailArg.toLowerCase().trim();
const passwordHash = await bcrypt.hash(passwordArg, 10);

const client = await new MongoClient(uri).connect();
try {
  const col = client.db(process.env.MONGODB_DB || "efoli").collection("admin_users");
  await col.createIndex({ email: 1 }, { unique: true });
  const now = new Date();
  const res = await col.updateOne(
    { email },
    { $set: { email, passwordHash, updatedAt: now }, $setOnInsert: { createdAt: now } },
    { upsert: true },
  );
  console.log(res.upsertedCount > 0 ? `Created admin user: ${email}` : `Updated admin password: ${email}`);
} finally {
  await client.close();
}
process.exit(0);
