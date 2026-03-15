export interface KriterOzet {
  id: number;
  kodu: string;
  adi: string;
  aciklama: string;
}

export interface DegerlendirmeTuruOzet {
  id: number;
  kodu: string;
  adi: string;
  aciklama: string;
}

export interface DegerlendirmeKriterResponse {
  id: number;
  version: number;
  degerlendirmeId: number;
  kriter: KriterOzet;
  kriterPuan: number;
  aciklama: string;
  ekleyenKullaniciId?: number;
  eklemeTarihi?: string;
}

export interface DegerlendirmeKriterRequest {
  degerlendirmeId: number;
  kriterKodu: string;
  kriterPuan: number;
  aciklama?: string;
}

export interface DersDegerlendirmeResponse {
  id: number;
  version: number;
  dersId: number;
  turu: DegerlendirmeTuruOzet;
  aciklama: string;
  ekleyenKullaniciId?: number;
  eklemeTarihi?: string;
  kriterler: DegerlendirmeKriterResponse[];
}

export interface DersDegerlendirmeRequest {
  dersId: number;
  turuKodu: string;
  aciklama?: string;
}
