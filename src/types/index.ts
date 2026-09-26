export interface ErrorApi extends Error {
  status?: number;
  code?: string;
  meta?: { target?: string[] };
}
