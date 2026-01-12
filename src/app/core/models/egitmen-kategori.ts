export interface EgitmenKategoriRequest {
  egitmenId: number;
  kategoriId: number;
}

export interface EgitmenKategoriResponse {
  id: number;
  version: number;
  egitmenId: number;
  kategoriId: number;
  ekleyenKullaniciId: number;
  eklemeTarihi: string;
}
