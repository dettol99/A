export type EdgeFunctionEnvelope<T> = {
  ok?: boolean;
  data?: T;
};

export function unwrapEdgeFunctionData<T>(payload: T | EdgeFunctionEnvelope<T> | null | undefined): T | null {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as EdgeFunctionEnvelope<T>).data ?? null;
  }

  return (payload as T | null | undefined) ?? null;
}
