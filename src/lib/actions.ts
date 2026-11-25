export type ActionResult = { ok: boolean; message: string; at?: number } | null;

export const ok = (message: string): ActionResult => ({ ok: true, message, at: Date.now() });
export const fail = (message: string): ActionResult => ({ ok: false, message, at: Date.now() });
