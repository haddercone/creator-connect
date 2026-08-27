import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher:
    "/((?!api|_next|fonts|examples|dashboard|not-found|creators|[\\w-]+\\.\\w+).*)/",
};

export async function proxy(request: NextRequest) {
  return NextResponse.next();
}
