export interface VideoDersKonu {
  id: number;
  version: number;
  dersId: number;
  bolumNumara: number;  // Gap-based value (1000, 2000, 3000...)
  bolumAdi: string;
  konuId: number;
  konuSiraNo: number;   // Gap-based value for ordering topics
  ekleyenKullaniciId?: number;
  eklemeTarihi?: string;
}

export interface VideoDersKonuRequest {
  dersId: number;
  bolumNumara: number;
  bolumAdi: string;
  konuId: number;
  konuSiraNo: number;
  version?: number;
  ekleyenKullaniciId?: number;
}

export interface VideoBolumGroup {
  bolumNumara: number;
  bolumAdi: string;
  konular: VideoDersKonu[];
}
