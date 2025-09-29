// src/app/n/[id]/reader.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function NoteReader({ id }: { id: string }) {
  const [pin, setPin] = useState("");
  const [asked, setAsked] = useState(false);

  const { data, error, refetch, isFetching } = useQuery({
    queryKey: ["note", id, pin],
    queryFn: async () => {
      const url = pin ? `/api/note/${id}?pin=${encodeURIComponent(pin)}` : `/api/note/${id}`;
      const res = await fetch(url);
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        const msg = e?.error || "Failed to fetch";
        throw new Error(msg);
      }
      return res.json() as Promise<{ content: string; burnAfterRead: boolean }>;
    },
    retry: false,
  });

  useEffect(() => {
    if (!asked && error?.message === "PIN required") {
      setAsked(true);
    }
  }, [error, asked]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl2 bg-white p-6 shadow-lofiglow border border-grape-200">
        <h2 className="mb-3 text-lg font-semibold">Note</h2>

        {error?.message === "PIN required" && (
          <div className="mb-3">
            <label className="text-sm font-medium">Enter PIN</label>
            <div className="mt-1 flex gap-2">
              <input
                className="rounded-xl2 border border-grape-300 bg-white p-2"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="4–8 digits"
                inputMode="numeric"
                pattern="\d*"
              />
              <button
                onClick={() => refetch()}
                className="rounded-xl2 bg-grape-600 px-4 py-2 text-white hover:bg-grape-700"
              >
                Unlock
              </button>
            </div>
          </div>
        )}

        {error && error.message !== "PIN required" && (
          <p className="text-sm text-red-700">Error: {error.message}</p>
        )}

        {isFetching && <p className="text-sm">Loading...</p>}

        {data && (
          <>
            {data.burnAfterRead && (
              <div className="mb-3 rounded-xl2 border border-grape-300 bg-grape-50 p-2 text-sm">
                This note was set to burn after read. Refreshing this page will likely fail because it has already been deleted.
              </div>
            )}
            <pre className="whitespace-pre-wrap rounded-xl2 border border-grape-300 bg-grape-50 p-3">
{data.content}
            </pre>
          </>
        )}
      </div>
    </div>
  );
}
