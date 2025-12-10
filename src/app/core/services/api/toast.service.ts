import { Injectable } from '@angular/core';

export interface ToastInfo {
  header?: string;
  body: string;
  delay?: number;
  classname?: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: ToastInfo[] = [];

  show(toast: ToastInfo) {
    this.toasts.push(toast);
  }

  /**
   * Başarı mesajı gösterir (yeşil)
   */
  success(message: string, header: string = 'Başarılı') {
    this.show({
      header,
      body: message,
      classname: 'bg-success text-light',
      delay: 5000
    });
  }

  /**
   * Hata mesajı gösterir (kırmızı)
   */
  error(message: string, header: string = 'Hata') {
    this.show({
      header,
      body: message,
      classname: 'bg-danger text-light',
      delay: 7000
    });
  }

  /**
   * Uyarı mesajı gösterir (sarı)
   */
  warning(message: string, header: string = 'Uyarı') {
    this.show({
      header,
      body: message,
      classname: 'bg-warning text-dark',
      delay: 6000
    });
  }

  /**
   * Bilgi mesajı gösterir (mavi)
   */
  info(message: string, header: string = 'Bilgi') {
    this.show({
      header,
      body: message,
      classname: 'bg-info text-dark',
      delay: 5000
    });
  }

  remove(toast: ToastInfo) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }

  clear() {
    this.toasts = [];
  }
}