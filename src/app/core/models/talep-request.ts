export interface TalepRequest {
  version: number;
  talepTarihi?: string; // ISO string
  talepSahibi?: string;
  talepKonusuKodu: string;
  talepIcerik: string;
  acilMi?: boolean;
}