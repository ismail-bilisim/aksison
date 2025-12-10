import { IslemTuruOzet } from './islem-turu-ozet';
import { KullaniciOzet } from './kullanici-ozet';

export interface DersIslemKayit {
  id: number;
  islemTuruKodu: string;
  islemTuru?: IslemTuruOzet;
  dersId: number;
  aciklama?: string;
  islemYapanKullaniciId: number;
  islemYapanKullanici?: KullaniciOzet;
  islemTarihi: string;
  version: number;
}
