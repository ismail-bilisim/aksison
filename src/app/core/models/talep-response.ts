import { TalepKonusuOzet } from './talep-konusu';
import { TalepDurumuOzet } from './talep-durumu';
import { TalepEkDosyaOzet } from './talep-ek-dosya';
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
  ekDosyalar?: TalepEkDosyaOzet[];
  ekleyenKullanici?: KullaniciOzet;
  guncelleyenKullanici?: KullaniciOzet;
  eklemeTarihi?: string;
  guncellemeTarihi?: string;
}