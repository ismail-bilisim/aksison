export interface EgitmenRequest {
  version?: number;
  kullaniciId: number;
  okulUniversiteAdi?: string | null;
  bolum?: string | null;
  akademikDereceler?: string | null;
  unvan?: string | null;
  uzmanlikAlani?: string | null;
  calisilanKurum?: string | null;
  cevrimIciTecrubesi?: number | null;
  sosyalMedyaHesabi?: string | null;
  webSitesi?: string | null;
  egitmenProfili?: string | null;
  kisaOzgecmis?: string | null;
}
