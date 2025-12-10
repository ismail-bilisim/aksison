/**
 * RFC 7807 Problem Details standardına uygun hata modeli
 */
export interface ProblemDetail {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  timestamp?: string;
  traceId?: string;
  errors?: { [key: string]: string };
  rootCause?: string;
  [key: string]: any; // Diğer özel alanlar için
}
