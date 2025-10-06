"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";

export default function NoteReader({ id }: { id: string }) {
  const [pinInput, setPinInput] = useState("");
  const [submittedPin, setSubmittedPin] = useState<string | undefined>(undefined);
  const [asked, setAsked] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const didAutoRefetch = useRef(false);

  const { data, error, refetch, isFetching } = useQuery({
    queryKey: ["note", id, submittedPin ?? null],
    queryFn: async () => {
      const url = submittedPin
        ? `/api/note/${id}?pin=${encodeURIComponent(submittedPin)}`
        : `/api/note/${id}`;
      const res = await fetch(url);
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || `HTTP ${res.status}`);
      return json as { content: string; burnAfterRead: boolean; expiresInSeconds: number };
    },
    retry: false,
  });

  useEffect(() => {
    if (!asked && error?.message === "PIN required") setAsked(true);
  }, [error, asked]);

  // Seed the countdown when we first get data (ignore burn-after-read since it deletes immediately)
  useEffect(() => {
    if (data && !data.burnAfterRead) {
      setSecondsLeft(typeof data.expiresInSeconds === "number" ? data.expiresInSeconds : null);
    }
  }, [data]);

  // Tick every second
  useEffect(() => {
    if (secondsLeft === null) return;
    const id = setInterval(() => {
      setSecondsLeft(prev => (prev === null ? null : Math.max(prev - 1, 0)));
    }, 1000);
    return () => clearInterval(id);
  }, [secondsLeft]);

  // When it hits 0, refetch once to show "expired"
  useEffect(() => {
    if (secondsLeft === 0 && !didAutoRefetch.current) {
      didAutoRefetch.current = true;
      refetch(); // will 404 → error message
    }
  }, [secondsLeft, refetch]);

  const canSubmit = /^\d{4,8}$/.test(pinInput);

  const handleUnlock = () => {
    if (!canSubmit) return;
    setSubmittedPin(pinInput);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleUnlock();
  };

  const mmss = useMemo(() => {
    if (secondsLeft === null) return null;
    const m = Math.floor(secondsLeft / 60);
    const s = secondsLeft % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }, [secondsLeft]);

  const expired = error?.message === "Not found or expired";

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
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="4–8 digits"
                inputMode="numeric"
                pattern="\d*"
              />
              <button
                onClick={handleUnlock}
                disabled={!canSubmit || isFetching}
                className="rounded-xl2 bg-grape-600 px-4 py-2 text-white hover:bg-grape-700 disabled:opacity-50"
              >
                {isFetching ? "Checking..." : "Unlock"}
              </button>
            </div>
            {!canSubmit && <p className="mt-1 text-xs text-grape-700">PIN must be 4–8 digits</p>}
          </div>
        )}

        {expired && <p className="text-sm text-red-700">This note has expired.</p>}

        {data && !expired && (
          <>
            {data.burnAfterRead && (
              <div className="mb-3 rounded-xl2 border border-grape-300 bg-grape-50 p-2 text-sm">
                This note was set to burn after read. Refreshing will fail because it has been deleted.
              </div>
            )}

            {!data.burnAfterRead && secondsLeft !== null && (
              <div className="mb-2 text-xs text-grape-700">Expires in {mmss}</div>
            )}

            <pre className="whitespace-pre-wrap rounded-xl2 border border-grape-300 bg-grape-50 p-3">
{data.content}
            </pre>
          </>
        )}

        {error && !expired && error.message !== "PIN required" && (
          <p className="text-sm text-red-700">Error: {error.message}</p>
        )}

        {isFetching && !data && !expired && <p className="text-sm">Loading...</p>}
      </div>
    </div>
  );
}
