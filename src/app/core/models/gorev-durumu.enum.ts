export enum GorevDurumu {
  ATANMADI = 'ATNMD',
  ATANDI = 'ATNDI',
  TAMAMLANDI = 'TAMAM',
  ONAYLANDI = 'ONYLI',
  IPTAL = 'IPTAL'
}

export const GOREV_DURUM_LABELS: Record<string, string> = {
  [GorevDurumu.ATANMADI]: 'Atanmadı',
  [GorevDurumu.ATANDI]: 'Atandı',
  [GorevDurumu.TAMAMLANDI]: 'Tamamlandı',
  [GorevDurumu.ONAYLANDI]: 'Onaylandı',
  [GorevDurumu.IPTAL]: 'İptal Edildi'
};

export const GOREV_DURUM_BADGE_CLASS: Record<string, string> = {
  [GorevDurumu.ATANMADI]: 'bg-secondary',
  [GorevDurumu.ATANDI]: 'bg-info',
  [GorevDurumu.TAMAMLANDI]: 'bg-warning text-dark',
  [GorevDurumu.ONAYLANDI]: 'bg-success',
  [GorevDurumu.IPTAL]: 'bg-dark'
};
