/**
 * TalepDurumu mapping utility
 * Maps backend TalepDurumu codes to Turkish labels and optional badge classes
 */

export enum TalepDurumu {
    YAPILACAK = 'YPLCK',
    DEVAM_EDEN = 'DEVAM',
    TAMAMLANDI = 'TAMAM',
    IPTAL = 'IPTAL'
}

export const TALEP_DURUMU_LABELS: Record<TalepDurumu, string> = {
    [TalepDurumu.YAPILACAK]: 'Yapılacak',
    [TalepDurumu.DEVAM_EDEN]: 'Devam Eden',
    [TalepDurumu.TAMAMLANDI]: 'Tamamlandı',
    [TalepDurumu.IPTAL]: 'İptal Edildi'
};

export const TALEP_DURUMU_BADGE: Record<TalepDurumu, string> = {
    [TalepDurumu.YAPILACAK]: 'bg-secondary',
    [TalepDurumu.DEVAM_EDEN]: 'bg-warning',
    [TalepDurumu.TAMAMLANDI]: 'bg-success',
    [TalepDurumu.IPTAL]: 'bg-danger'
};

export const TALEP_DURUMU_CODES = Object.values(TalepDurumu) as string[];



