// src/app/page.tsx
"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { ttlOptions } from "@/lib/schemas";
import { PurpleSelect } from "@/components/PurpleSelect";
import { PurpleCheckbox } from "@/components/PurpleCheckbox";

type CreatePayload = {
  content: string;
  ttlSeconds: number;
  burnAfterRead: boolean;
  pin?: string;
};

export default function HomePage() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState(ttlOptions[1].value); // default 1 hour
  const [burn, setBurn] = useState(false);
  const [pin, setPin] = useState("");
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const createNote = useMutation({
    mutationFn: async (payload: CreatePayload) => {
      const res = await fetch("/api/note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to create note");
      return res.json() as Promise<{ id: string; url: string }>;
    },
    onSuccess: (data) => setShareUrl(data.url),
  });

  return (
    <div className="space-y-6">
      <div className="rounded-xl2 bg-white p-6 shadow-lofiglow border border-grape-200">
        <h2 className="mb-3 text-lg font-semibold">Create a temporary note</h2>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type or paste your note..."
          className="w-full h-48 rounded-xl2 border border-grape-300 bg-grape-50/50 p-3 outline-none focus:ring-2 focus:ring-grape-400"
        />

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Expiry */}
          <div className="space-y-3">
            <span className="font-medium ml-0.5">Expiry</span>
            <PurpleSelect
              value={String(ttl)}
              onValueChange={(v) => setTtl(Number(v))}
              options={ttlOptions.map(o => ({ label: o.label, value: String(o.value) }))}
              className="w-full h-10 mt-3"
            />
          </div>

          {/* PIN */}
          <div className="space-y-1 ml-5">
            <span className="mb-1 font-medium pb-1 ml-0.5">Optional PIN (4–8 digits)</span>
            <input
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              inputMode="numeric"
              pattern="\d*"
              placeholder="e.g. 1234"
              className="h-10 rounded-xl2 border border-grape-300 bg-white/80 px-3
                        focus:outline-none focus:ring-2 focus:ring-grape-400 mt-3"
            />
          </div>

          {/* Burn after read – stick to the TOP of its grid cell */}
          <div className="place-self-center">
            <PurpleCheckbox
              checked={burn}
              onCheckedChange={(v) => setBurn(v)}
              label="Burn after read"
            />
          </div>
        </div>



        <button
          onClick={() =>
            createNote.mutate({
              content,
              ttlSeconds: ttl,
              burnAfterRead: burn,
              pin: pin.trim() ? pin.trim() : undefined,
            })
          }
          disabled={createNote.isPending}
          className="mt-4 rounded-xl2 bg-grape-600 px-4 py-2 text-white hover:bg-grape-700 disabled:opacity-50"
        >
          {createNote.isPending ? "Creating..." : "Create link"}
        </button>

        {shareUrl && (
          <div className="mt-4 rounded-xl2 border border-grape-300 bg-grape-50 p-3">
            <p className="text-sm mb-2">Share this link:</p>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={shareUrl}
                className="flex-1 rounded-xl2 border border-grape-300 bg-white p-2"
              />
              <button
                onClick={() => navigator.clipboard.writeText(shareUrl)}
                className="rounded-xl2 border border-grape-300 bg-white px-3 py-2 hover:bg-grape-100"
              >
                Copy
              </button>
              <a
                href={shareUrl}
                className="rounded-xl2 bg-grape-600 px-3 py-2 text-white hover:bg-grape-700"
              >
                Open
              </a>
            </div>
            <p className="mt-2 text-xs text-grape-700">
              Notes expire automatically. If “burn after read” is on, the note is deleted as soon as it is opened.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
