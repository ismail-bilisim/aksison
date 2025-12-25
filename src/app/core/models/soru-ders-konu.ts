import { SoruOzet } from './soru-ozet';
import { SoruRequest } from './soru-request';

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

export interface SoruVideoDersKonuRequest {
  dersId: number;
  konuId?: number | null;
  soru: SoruRequest;
  version?: number;
  ekleyenKullaniciId?: number;
}
