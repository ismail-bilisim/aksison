export interface BolumResponse {
  id: number;
  version: number;
  baslik: string;
  aciklama: string;
  ekleyenKullanici?: {
    id: number;
    adi: string;
    soyadi: string;
  };
  eklemeTarihi?: string;
  bolumKonular?: BolumKonuResponse[];
}

export interface BolumRequest {
  baslik: string;
  aciklama: string;
  version?: number;
  ekleyenKullaniciId?: number;
}

export interface BolumKonuResponse {
  id: number;
  version: number;
  bolumId: number;
  konu: {
    id: number;
    baslik: string;
    aciklama: string;
  };
  konuSiraNo: number;
  ekleyenKullaniciId?: number;
  eklemeTarihi?: string;
}

export interface BolumKonuRequest {
  bolumId: number;
  konu: {
    baslik: string;
    aciklama: string;
    version?: number;
  };
  oncekiSiraNo?: number | null;
  sonrakiSiraNo?: number | null;
  version?: number;
  ekleyenKullaniciId?: number;
}

export interface DersBolumResponse {
  id: number;
  version: number;
  dersId?: number;
  bolum: BolumResponse;
  bolumSiraNo: number;
  ekleyenKullaniciId?: number;
  eklemeTarihi?: string;
}

export interface DersBolumRequest {
  dersId: number;
  bolum: BolumRequest;
  oncekiSiraNo?: number | null;
  sonrakiSiraNo?: number | null;
  version?: number;
}