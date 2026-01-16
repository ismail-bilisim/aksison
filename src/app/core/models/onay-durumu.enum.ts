/**
 * Onay Durumu Enum
 * Backend OnayDurumuEn.java ile senkronize
 * Tek kaynak: Tüm onay durumu kontrolleri bu dosyadan yapılmalıdır
 */
export enum OnayDurumu {
  TASLAK = 'TAS',
  ONAYA_SUNULDU = 'ONS',
  ONAYLI = 'ONY',
  RED = 'RED'
}

/**
 * OnayDurumu yardımcı sınıfı
 * Metin, badge ve icon bilgilerini döndürür
 */
export class OnayDurumuHelper {
  static getText(kod: string | undefined | null): string {
    switch (kod) {
      case OnayDurumu.TASLAK:
        return 'Taslak';
      case OnayDurumu.ONAYA_SUNULDU:
        return 'Onaya Sunuldu';
      case OnayDurumu.ONAYLI:
        return 'Onaylandı';
      case OnayDurumu.RED:
        return 'Red Edildi';
      default:
        return 'Bilinmeyen';
    }
  }

  static getBadgeClass(kod: string | undefined | null): string {
    switch (kod) {
      case OnayDurumu.TASLAK:
        return 'bg-secondary';
      case OnayDurumu.ONAYA_SUNULDU:
        return 'bg-warning text-dark';
      case OnayDurumu.ONAYLI:
        return 'bg-success';
      case OnayDurumu.RED:
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }

  static getIcon(kod: string | undefined | null): string {
    switch (kod) {
      case OnayDurumu.TASLAK:
        return 'bi-pencil-square';
      case OnayDurumu.ONAYA_SUNULDU:
        return 'bi-hourglass-split';
      case OnayDurumu.ONAYLI:
        return 'bi-check-circle';
      case OnayDurumu.RED:
        return 'bi-x-circle';
      default:
        return 'bi-question-circle';
    }
  }
}
