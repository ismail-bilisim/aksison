export interface EgitmenSertifikaResponse {
  id: number;
  version: number;
  egitmenId: number;
  sertifikaAdi: string;
  dosyaAdi: string;
  dosyaYolu: string;
  dosyaBoyutu: number;
  mimeType: string;
  ekleyenKullaniciId: number;
  eklemeTarihi: string;
}
