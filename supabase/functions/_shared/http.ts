export const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };
export function json(body: unknown, init: ResponseInit = {}) { return new Response(JSON.stringify(body), { ...init, headers: { 'content-type': 'application/json', ...corsHeaders, ...(init.headers ?? {}) } }); }
