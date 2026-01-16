import { IslemTuruOzet } from './islem-turu-ozet';
import { KullaniciOzet } from './kullanici-ozet';

/**
 * Base interface for all operation log entities.
 * Following Interface Segregation Principle - contains only common properties.
 * Following Open/Closed Principle - open for extension via specific implementations.
 */
export interface IslemKayit {
  id: number;
  islemTuru?: IslemTuruOzet;
  aciklama?: string;
  // islemYapanKullaniciId: number; //TODO sil
  islemYapanKullanici?: KullaniciOzet;
  islemTarihi: string;
  version: number;
}
