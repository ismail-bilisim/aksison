export interface HedefKitleEgitimSeviyesiResponse {
  id: number;
  version: number;
  kodu: string;
  adi: string;
  ekleyenKullaniciId?: number;
  eklemeTarihi?: string;
}