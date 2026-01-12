export interface SozlesmeResponse {
  id: number;
  version: number;
  egitmenId: number;
  baslangicTarihi: string;
  imzaTarihi: string;
  sozlesmeDetails: string;
  dosyaAdi: string;
  pdfDosya?: Uint8Array;
}
