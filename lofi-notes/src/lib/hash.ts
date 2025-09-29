// src/lib/hash.ts
import crypto from "crypto";

export function hashPin(pin: string, salt: string) {
  return crypto.createHash("sha256").update(`${salt}:${pin}`).digest("hex");
}