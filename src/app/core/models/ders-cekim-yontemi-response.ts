export interface DersCekimYontemiResponse {
  id: number;
  version: number;
  kodu: string;
  adi: string;
  ekleyenKullaniciId?: number;
  eklemeTarihi?: string;
}