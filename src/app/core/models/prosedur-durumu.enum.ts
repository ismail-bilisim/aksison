export enum ProsedurDurumu {
  TASLAK = 'TASLK',
  ONAY_BEKLIYOR = 'ONYBK',
  YURURLUKTE = 'YURUL',
  MULGA = 'MULGA',
  IPTAL = 'IPTAL'
}

export const PROSEDUR_DURUM_LABELS: Record<string, string> = {
  [ProsedurDurumu.TASLAK]: 'Taslak',
  [ProsedurDurumu.ONAY_BEKLIYOR]: 'Onay Bekliyor',
  [ProsedurDurumu.YURURLUKTE]: 'Yürürlükte',
  [ProsedurDurumu.MULGA]: 'Mülga',
  [ProsedurDurumu.IPTAL]: 'İptal'
};

export const PROSEDUR_DURUM_BADGE_CLASS: Record<string, string> = {
  [ProsedurDurumu.TASLAK]: 'bg-secondary',
  [ProsedurDurumu.ONAY_BEKLIYOR]: 'bg-warning text-dark',
  [ProsedurDurumu.YURURLUKTE]: 'bg-success',
  [ProsedurDurumu.MULGA]: 'bg-dark',
  [ProsedurDurumu.IPTAL]: 'bg-danger'
};
