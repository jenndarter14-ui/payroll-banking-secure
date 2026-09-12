import { createServerClient } from "@supabase/ssr";
// Local Next.js shims for environments that don't include Next types.
type CookieRecord = { name: string; value: string; options?: unknown };
type NextRequest = {
  headers: Headers;
  cookies: { getAll(): CookieRecord[]; set(name: string, value: string, options?: unknown): void };
};
class NextResponse {
  cookies: { set(name: string, value: string, options?: unknown): void } = { set() {} };
  static next(init?: { request?: { headers?: Headers } }) { return new NextResponse(); }
  constructor(public body?: BodyInit | null, public init?: ResponseInit) {}
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const createClient = (request: NextRequest) => {
  // Create an unmodified response
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    },
  );

  return supabaseResponse
};