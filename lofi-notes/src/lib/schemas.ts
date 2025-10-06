// src/lib/schemas.ts
import { z } from "zod";

export const ttlOptions = [
  { label: "1 minute", value: 60},
  { label: "5 minutes", value: 5 * 60},
  { label: "15 minutes", value: 15 * 60 },
  { label: "1 hour", value: 60 * 60 },
  { label: "1 day", value: 24 * 60 * 60 },
  { label: "7 days", value: 7 * 24 * 60 * 60 },
] as const;

export const createNoteSchema = z.object({
  content: z.string().min(1, "Note cannot be empty").max(5000, "Max 5000 characters"),
  ttlSeconds: z.number().int().positive(),
  burnAfterRead: z.boolean().default(false),
  pin: z.string().optional().transform(v => (v?.trim() ? v.trim() : undefined)).refine(v => !v || (/^\d{4,8}$/.test(v)), {
    message: "PIN must be 4 to 8 digits",
  }),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;

export type NoteRecord = {
  content: string;
  createdAt: number;
  ttlSeconds: number;
  burnAfterRead: boolean;
  pinHash?: string;
};
