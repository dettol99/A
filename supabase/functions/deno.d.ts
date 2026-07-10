declare namespace Deno {
  export function serve(handler: (request: Request) => Response | Promise<Response>): void;
  export namespace env {
    export function get(name: string): string | undefined;
  }
}

declare module 'https://esm.sh/@supabase/supabase-js@2' {
  export function createClient(url: string, key: string, options?: unknown): any;
}
