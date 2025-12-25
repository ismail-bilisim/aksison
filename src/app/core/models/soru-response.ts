import { KullaniciOzet } from './kullanici-ozet';
import { ZorlukDerecesiOzet } from './zorluk-derecesi-ozet';
import { SoruTipiOzet } from './soru-tipi-ozet';

export interface SoruResponse {
  id: number;
  version: number;
  soruTipi: SoruTipiOzet;
  soruMetni: string;
  zorlukDerecesi: ZorlukDerecesiOzet;
  secenekSayisi: number;
  secenek1: string;
  secenek2: string;
  secenek3?: string;
  secenek4?: string;
  dogruSecenek: number;
  kontroluYapan?: KullaniciOzet;
  kontrolAciklama?: string;
  ekleyenKullanici?: KullaniciOzet;
  eklemeTarihi?: string;
}

