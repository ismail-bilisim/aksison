import { TalepKonusuOzet } from './talep-konusu';
import { TalepDurumuOzet } from './talep-durumu';
import { TalepEkdosyaOzet } from './talep-ekdosya';
import { KullaniciOzet } from './kullanici-ozet';

export interface TalepResponse {
  id: number;
  version: number;
  talepKonusu: TalepKonusuOzet;
  talepIcerik: string;
  talepTarihi: string; // ISO string
  talepSahibi: string;
  atananKisi: KullaniciOzet;
  talepSonuc?: string;
  talepDurumu: TalepDurumuOzet;
  kapanisTarihi?: string;
  onayDurumu?: string;
  ekDosyalar?: TalepEkdosyaOzet[];
  ekleyenKullanici?: KullaniciOzet;
  guncelleyenKullanici?: KullaniciOzet;
  eklemeTarihi?: string;
  guncellemeTarihi?: string;
}