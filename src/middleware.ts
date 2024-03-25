import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { ALLOWED_REQUESTS } from "./config/rateLimit";

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(
    ALLOWED_REQUESTS, '3600 s'
  ),
});

export const config = {
  matcher:
    "/((?!api|_next|fonts|examples|dashboard|not-found|creators|[\\w-]+\\.\\w+).*)/",
};

export default async function middleware(request: NextRequest) {
  const ip = request.ip ?? "127.0.0.1";
  if (request.method === "POST") {
    const { limit, reset, remaining } = await ratelimit.limit(
      ip
    );

    if (remaining === 0) {
      return new NextResponse(
        JSON.stringify({ error: "Rate limit exceeded" }),
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        }
      );
    } 
    return NextResponse.next();
  }
}
