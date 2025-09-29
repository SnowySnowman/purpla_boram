// src/app/api/note/route.ts
import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { customAlphabet } from "nanoid";
import { createNoteSchema, NoteRecord } from "@/lib/schemas";
import { hashPin } from "@/lib/hash";

const idGen = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 8);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createNoteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const { content, ttlSeconds, burnAfterRead, pin } = parsed.data;

    // Hard limit to prevent abuse
    if (ttlSeconds > 7 * 24 * 60 * 60) {
      return NextResponse.json({ error: "TTL too large" }, { status: 400 });
    }

    const id = idGen();
    const record: NoteRecord = {
      content,
      createdAt: Date.now(),
      ttlSeconds,
      burnAfterRead,
      pinHash: pin ? hashPin(pin, process.env.PIN_SALT || "") : undefined,
    };

    // Store with TTL
    await redis.set(`note:${id}`, record, { ex: ttlSeconds });

    const proto = req.headers.get("x-forwarded-proto") || "http";
    const host = req.headers.get("host");
    const base = process.env.NEXT_PUBLIC_APP_URL || `${proto}://${host}`;
    const url = `${base}/n/${id}`;

    return NextResponse.json({ id, url });
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
