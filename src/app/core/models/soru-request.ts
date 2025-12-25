
export interface SoruRequest {
  soruTipi: string;
  soruMetni: string;
  zorlukDerecesi: string;
  secenekSayisi: number;
  secenek1: string;
  secenek2: string;
  secenek3?: string;
  secenek4?: string;
  dogruSecenek: number;
  version?: number;
  ekleyenKullaniciId?: number;
}

