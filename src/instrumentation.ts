import type { Instrumentation } from "next";

/** Captures every unhandled server error (pages, route handlers, server actions). */
export const onRequestError: Instrumentation.onRequestError = async (err, request, context) => {
  const { reportError } = await import("@/lib/monitoring");
  const e = err as Error & { digest?: string };
  await reportError("server", {
    message: e.message?.slice(0, 1000),
    digest: e.digest,
    path: request.path,
    method: request.method,
    routePath: context.routePath,
    routeType: context.routeType,
  });
};
