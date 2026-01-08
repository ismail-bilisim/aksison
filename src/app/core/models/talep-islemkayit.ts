import { IslemTuruOzet } from './islem-turu-ozet';
import { KullaniciOzet } from './kullanici-ozet';

export interface TalepIslemkayit {
  id: number;
  islemTuru?: IslemTuruOzet;
  talepId: number;
  aciklama?: string;
  islemYapanKullaniciId: number;
  islemYapanKullanici?: KullaniciOzet;
  islemTarihi: string;
  version: number;
}