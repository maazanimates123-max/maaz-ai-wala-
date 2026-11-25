import { NextResponse } from "next/server";

/** No login system: nothing to protect. Kept minimal so the API stays private-by-default via robots. */
export function proxy() {
  return NextResponse.next();
}

export const config = { matcher: ["/api/:path*"] };
