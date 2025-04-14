
export type SupabaseResponse<T> = {
  data: T | null;
  error: Error | null;
};
