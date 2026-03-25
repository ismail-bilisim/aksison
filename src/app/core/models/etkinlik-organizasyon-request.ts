export interface EtkinlikOrganizasyonRequest {
  version?: number;
  adi: string;
  amaci?: string;
  aciklama?: string;
  turuKodu?: string;
  temaKodu?: string;
  hedefKitle?: string;
  kazanimlar?: string;
  sikcaSorulanSorular?: string;
  sartlarKurallar?: string;
  suresi?: number;
  baslamaTarihi?: string;
  bitisTarihi?: string;
  yeri?: string;
  basvuruTarihi?: string;
  basvuruBitisTarihi?: string;
  sehirKodu?: string;
  kontenjan?: number;
  etkinlikYoneticisiId?: number;
  grafikDuzenleyiciId?: number;
  medyaSorumluId?: number;
}
