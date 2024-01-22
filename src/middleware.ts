import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';

const ratelimit = new Ratelimit({
  redis: kv,
  // 6 requests from the same IP in 1 hour
  limiter: Ratelimit.slidingWindow(5, '100 s'),
});

// Define which routes you want to rate limit
export const config = {
  matcher: "/((?!api|_next|fonts|examples|dashboard|not-found|[\\w-]+\\.\\w+).*)/",
}

export default async function middleware(request: NextRequest) {
  // You could alternatively limit based on user ID or similar
  const ip = request.ip ?? '127.0.0.1';
  console.log("IP: ", ip);
  if(request.method === 'POST') {
    const { success, pending, limit, reset, remaining } = await ratelimit.limit(ip)
    console.log("limit: ", limit);
    console.log("remaining", remaining);
    
    if(remaining === 0) {
      return new NextResponse(JSON.stringify({error: "Rate limit exceeded"}), {
        status: 429,
        headers: {
          'X-RateLimit-Limit':limit.toString(),
          'X-RateLimit-Remaining':remaining.toString(),
          'X-RateLimit-Reset':reset.toString(),
        }
      })
    } else {
      NextResponse.next()
    }
    // console.log("success: ", success);
    // console.log("remaining: ", remaining);

    // return success
    //   ? NextResponse.next()
    //   : NextResponse.redirect("/");
  }
  return NextResponse.next();
}
