export interface EtkinlikOrganizasyonSurecGorevRequest {
  surecId: number;
  gorevKodu: string;
  gorevliId?: number;
  gorevDurumu?: string;
  aciklama?: string;
  version?: number;
}
