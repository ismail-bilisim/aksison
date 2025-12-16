export interface KonuResponse {
  id: number;
  version: number;
  baslik: string;
  aciklama: string;
  ekleyenKullaniciId?: number;
  eklemeTarihi?: string;
}

export interface KonuRequest {
  id?: number;
  baslik: string;
  aciklama: string;
  version?: number;
}

export interface DersKonu {
  id: number;
  version: number;
  dersId: number;
  bolumNumara: number;
  bolumAdi: string;
  konu: KonuResponse;
  konuSiraNo: number;
  ekleyenKullaniciId?: number;
  eklemeTarihi?: string;
}

export interface DersKonuRequest {
  dersId: number;
  bolumNumara: number;
  bolumAdi: string;
  konu: KonuRequest;
  previousKonuSiraNo?: number;
  nextKonuSiraNo?: number;
  version?: number;
}

export interface BolumGroup {
  bolumNumara: number;
  bolumAdi: string;
  konular: DersKonu[];
}