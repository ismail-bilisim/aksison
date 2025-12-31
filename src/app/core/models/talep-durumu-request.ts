export interface TalepDurumuRequest {
  id?: number;
  version?: number;
  kodu: string;
  adi: string;
  sira?: number;
  aktifMi?: boolean;
  ekleyenKullaniciId?: number; // Backend sets this
}
