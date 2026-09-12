declare module 'next/server' {
  export interface NextRequest {
    headers: Headers;
    cookies: {
      getAll(): Array<{ name: string; value: string; options?: any }>;
      set(name: string, value: string): void;
    };
  }

  export class NextResponse {
    static next(init?: { request?: { headers?: Headers } }): NextResponse;
    cookies: {
      set(name: string, value: string, options?: any): void;
    };
    constructor(body?: BodyInit | null, init?: ResponseInit);
  }
}

declare module 'next/headers' {
  export function cookies(): Promise<{
    getAll(): Array<{ name: string; value: string; options?: any }>;
    set(name: string, value: string, options?: any): void;
  }>;
}
