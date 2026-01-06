/**
 * OnayDurumu enum mapping utility
 * Maps backend enum codes to Turkish descriptions and badge styles
 * Based on btk.aksisboot.enums.OnayDurumu
 */

/**
 * OnayDurumu enum - matches backend OnayDurumuEn enum codes
 */
export enum OnayDurumu {
  TASLAK = 'tas',
  ONAYA_SUNULDU = 'ons',
  ONAYLI = 'ony',
  RED = 'red'
}

/**
 * All valid OnayDurumu codes as a constant array
 */
export const ONAY_DURUMU_CODES = ['tas', 'ons', 'ony', 'red'] as const;

export interface OnayDurumuInfo {
  kod: string;
  aciklama: string;
  badgeClass: string;
  icon: string;
}

export const ONAY_DURUMU_MAP: Record<string, OnayDurumuInfo> = {
  'tas': {
    kod: 'tas',
    aciklama: 'Taslak',
    badgeClass: 'bg-secondary',
    icon: 'bi-pencil-square'
  },
  'ons': {
    kod: 'ons',
    aciklama: 'Onaya Sunuldu',
    badgeClass: 'bg-warning text-dark',
    icon: 'bi-hourglass-split'
  },
  'ony': {
    kod: 'ony',
    aciklama: 'Onaylandı',
    badgeClass: 'bg-success',
    icon: 'bi-check-circle'
  },
  'red': {
    kod: 'red',
    aciklama: 'Red edildi',
    badgeClass: 'bg-danger',
    icon: 'bi-x-circle'
  },
  'dei': {
    kod: 'dei',
    aciklama: 'Değişiklik İstendi',
    badgeClass: 'bg-info text-dark',
    icon: 'bi-arrow-repeat'
  }
};

/**
 * Get OnayDurumu information by code
 * @param kod - OnayDurumu code (tas, ons, ony, red, dei)
 * @returns OnayDurumuInfo object or undefined if not found
 */
export function getOnayDurumuInfo(kod?: string): OnayDurumuInfo | undefined {
  if (!kod) return undefined;
  return ONAY_DURUMU_MAP[kod];
}

/**
 * Get OnayDurumu description by code
 * @param kod - OnayDurumu code
 * @returns Turkish description or 'Belirtilmemiş' if not found
 */
export function getOnayDurumuAciklama(kod?: string | null): string {
  const info = getOnayDurumuInfo(kod?? undefined);
  return info?.aciklama || 'Belirtilmemiş';
}

/**
 * Get OnayDurumu badge CSS class by code
 * @param kod - OnayDurumu code
 * @returns Bootstrap badge class
 */
export function getOnayDurumuBadgeClass(kod?: string | null): string {
  const info = getOnayDurumuInfo(kod?? undefined);
  return info?.badgeClass || 'bg-secondary';
}

/**
 * Get OnayDurumu icon class by code
 * @param kod - OnayDurumu code
 * @returns Bootstrap icon class
 */
export function getOnayDurumuIcon(kod?: string | null): string {
  const info = getOnayDurumuInfo(kod?? undefined);
  return info?.icon || 'bi-question-circle';
}
