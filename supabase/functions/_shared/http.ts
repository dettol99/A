export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

export function json(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...corsHeaders,
      ...(init.headers ?? {}),
    },
  });
}

export function error(message: string, status = 400, details?: unknown) {
  return json({ ok: false, error: message, details }, { status });
}

export async function readJson<T extends Record<string, unknown>>(req: Request): Promise<Partial<T>> {
  if (req.method === 'GET') return Object.fromEntries(new URL(req.url).searchParams) as Partial<T>;

  const text = await req.text();
  if (!text.trim()) return {};

  try {
    return JSON.parse(text) as Partial<T>;
  } catch {
    throw new Error('Invalid JSON request body');
  }
}

export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  const text = await response.text();
  const parsed = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(
      typeof parsed?.status_message === 'string'
        ? parsed.status_message
        : typeof parsed?.message === 'string'
          ? parsed.message
          : `Request failed with status ${response.status}`,
    );
  }

  return parsed as T;
}

export function requiredEnv(name: string) {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing required secret: ${name}`);
  return value;
}
