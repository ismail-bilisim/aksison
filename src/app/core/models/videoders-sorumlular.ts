import { KullaniciOzet } from './kullanici-ozet';

export interface VideodersSorumlular {
  id: number;
  icerikYoneticisi: KullaniciOzet | null;
  projeYoneticisi: KullaniciOzet | null;
  materyalGelistirici: KullaniciOzet | null;
  kontrolEden: KullaniciOzet | null;
  grafikDuzenleyici: KullaniciOzet | null;
  videoDuzenleyici: KullaniciOzet | null;
  lmsSorumlu: KullaniciOzet | null;
  medyaSorumlu: KullaniciOzet | null;
  ekleyen: KullaniciOzet | null;
  guncelleyen: KullaniciOzet | null;
}
