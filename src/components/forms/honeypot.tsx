"use client";
import { useState } from "react";

/** Hidden honeypot + render timestamp used for server-side spam checks. */
export function SpamGuard() {
  const [startedAt] = useState(() => Date.now());
  return (
    <>
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company_website">Leave this field empty</label>
        <input id="company_website" name="company_website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>
      <input type="hidden" name="form_started_at" value={startedAt} />
    </>
  );
}
