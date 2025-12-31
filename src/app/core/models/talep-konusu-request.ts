export interface TalepKonusuRequest {
  id?: number;
  version?: number;
  kodu: string;
  adi: string;
  aciklama?: string;
  aktifMi?: boolean;
  ekleyenKullaniciId?: number; // Backend sets this
}
