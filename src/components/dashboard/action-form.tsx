"use client";
import { useActionState, useEffect, useId, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import type { ActionResult } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Action = (prev: ActionResult, formData: FormData) => Promise<ActionResult>;

/** Form bound to a server action, with inline success / error feedback. */
export function ActionForm({
  action,
  children,
  className,
  resetOnSuccess = false,
}: {
  action: Action;
  children: React.ReactNode;
  className?: string;
  resetOnSuccess?: boolean;
}) {
  const [state, formAction] = useActionState(action, null);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok && resetOnSuccess) ref.current?.reset();
  }, [state, resetOnSuccess]);
  return (
    <form ref={ref} action={formAction} className={className}>
      {children}
      {state && (
        <p role={state.ok ? "status" : "alert"} className={cn("mt-3 flex items-center gap-2 text-sm", state.ok ? "text-neon" : "text-danger")}>
          {state.ok ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {state.message}
        </p>
      )}
    </form>
  );
}

export function SubmitButton({ children, variant = "primary", size = "sm", className, name, value }: {
  children: React.ReactNode; variant?: "primary" | "secondary" | "outline" | "danger" | "ghost"; size?: "sm" | "md"; className?: string; name?: string; value?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant={variant} size={size} disabled={pending} className={className} name={name} value={value}>
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
}

/**
 * Submit button that first opens an accessible confirmation dialog.
 * Must be rendered inside an ActionForm (or any <form>).
 */
export function ConfirmButton({ children, title, description, confirmLabel = "Confirm", variant = "danger", name, value }: {
  children: React.ReactNode; title: string; description: string; confirmLabel?: string; variant?: "danger" | "primary" | "secondary"; name?: string; value?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const hiddenRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const { pending } = useFormStatus();
  const titleId = useId();

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <>
      <Button ref={triggerRef} type="button" variant={variant} size="sm" disabled={pending} onClick={() => setOpen(true)}>
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </Button>
      {/* hidden real submit button carries name/value */}
      <button ref={hiddenRef} type="submit" name={name} value={value} hidden tabIndex={-1} aria-hidden />
      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        aria-labelledby={titleId}
        className="m-auto w-[min(92vw,420px)] rounded-2xl border border-line bg-elevated p-0 text-white backdrop:bg-black/70 backdrop:backdrop-blur-sm"
      >
        <div className="p-6">
          <h2 id={titleId} className="text-lg font-semibold">{title}</h2>
          <p className="mt-2 text-sm text-muted">{description}</p>
          <div className="mt-6 flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => { setOpen(false); triggerRef.current?.focus(); }}>Cancel</Button>
            <Button
              type="button"
              variant={variant}
              size="sm"
              autoFocus
              onClick={() => {
                setOpen(false);
                hiddenRef.current?.click();
              }}
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </dialog>
    </>
  );
}
