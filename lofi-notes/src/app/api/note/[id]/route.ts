// src/app/api/note/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { NoteRecord } from "@/lib/schemas";
import { hashPin } from "@/lib/hash";

type Params = { params: { id: string } };

export async function GET(req: NextRequest, { params }: Params) {
  const id = params.id;
  const key = `note:${id}`;

  const data = await redis.get<NoteRecord>(key);
  if (!data) {
    return NextResponse.json({ error: "Not found or expired" }, { status: 404 });
  }

  const ttl = await redis.ttl(key); // seconds remaining

  const pin = req.nextUrl.searchParams.get("pin") ?? undefined;
  if (data.pinHash) {
    if (!pin) return NextResponse.json({ error: "PIN required" }, { status: 401 });
    const ok = data.pinHash === hashPin(pin, process.env.PIN_SALT || "");
    if (!ok) return NextResponse.json({ error: "Invalid PIN" }, { status: 401 });
  }

  if (data.burnAfterRead) {
    await redis.del(key);
  }

  return NextResponse.json({
    content: data.content,
    burnAfterRead: data.burnAfterRead,
    expiresInSeconds: Math.max(ttl ?? 0, 0),
  });
}
