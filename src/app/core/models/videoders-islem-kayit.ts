import { IslemTuruOzet } from './islem-turu-ozet';
import { KullaniciOzet } from './kullanici-ozet';

export interface VideoDersIslemKayit {
  id: number;
  islemTuruKodu: string;
  islemTuru?: IslemTuruOzet;
  videoDersId: number;
  aciklama?: string;
  islemYapanKullaniciId: number;
  islemYapanKullanici?: KullaniciOzet;
  islemTarihi: string;
  version: number;
}
