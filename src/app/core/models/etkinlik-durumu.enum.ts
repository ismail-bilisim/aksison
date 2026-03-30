export enum EtkinlikDurumu {
  TASLAK = 'TASLK',
  ONAY_BEKLIYOR = 'ONYBK',
  ONAYLANDI = 'ONAYL',
  TAMAMLANDI = 'TAMAM',
  REDDEDILDI = 'REDDI',
  IPTAL = 'IPTAL'
}

export const ETKINLIK_DURUM_LABELS: Record<string, string> = {
  [EtkinlikDurumu.TASLAK]: 'Taslak',
  [EtkinlikDurumu.ONAY_BEKLIYOR]: 'Onay Bekliyor',
  [EtkinlikDurumu.ONAYLANDI]: 'Onaylandı',
  [EtkinlikDurumu.TAMAMLANDI]: 'Tamamlandı',
  [EtkinlikDurumu.REDDEDILDI]: 'Reddedildi',
  [EtkinlikDurumu.IPTAL]: 'İptal'
};

export const ETKINLIK_DURUM_BADGE_CLASS: Record<string, string> = {
  [EtkinlikDurumu.TASLAK]: 'bg-secondary',
  [EtkinlikDurumu.ONAY_BEKLIYOR]: 'bg-warning text-dark',
  [EtkinlikDurumu.ONAYLANDI]: 'bg-success',
  [EtkinlikDurumu.TAMAMLANDI]: 'bg-primary',
  [EtkinlikDurumu.REDDEDILDI]: 'bg-danger',
  [EtkinlikDurumu.IPTAL]: 'bg-dark'
};
