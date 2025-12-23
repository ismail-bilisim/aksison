import { SoruOzet } from './soru-ozet';

export interface SoruVideoDersKonuResponse {
  id: number;
  version: number;
  dersId: number;
  konuId: number | null;
  soruId: number;
  soru: SoruOzet;
  ekleyenKullaniciId?: number;
  eklemeTarihi?: string;
}

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

export interface SoruVideoDersKonuRequest {
  dersId: number;
  konuId?: number | null;
  soru: SoruRequest;
  version?: number;
  ekleyenKullaniciId?: number;
}
