import { HttpErrorResponse } from '@angular/common/http';
import { ProblemDetail } from '../models/problem-detail';

/**
 * HTTP hata mesajlarını kullanıcı dostu mesajlara dönüştürür
 */
export class ErrorHandler {
  
  /**
   * HttpErrorResponse'tan kullanıcı dostu mesaj çıkarır
   */
  static extractErrorMessage(error: HttpErrorResponse): string {
    // RFC 7807 ProblemDetail formatı kontrolü
    if (error.error && this.isProblemDetail(error.error)) {
      const problem = error.error as ProblemDetail;
      return problem.detail || problem.title || 'Bir hata oluştu';
    }

    // Validation errors (field errors)
    if (error.error?.errors && typeof error.error.errors === 'object') {
      const fieldErrors = Object.entries(error.error.errors)
        .map(([field, message]) => `${field}: ${message}`)
        .join('\n');
      return fieldErrors || 'Doğrulama hatası oluştu';
    }

    // Basit error.message
    if (error.error?.message) {
      return error.error.message;
    }

    // HttpErrorResponse status mesajları
    switch (error.status) {
      case 0:
        return 'Sunucuya bağlanılamıyor. İnternet bağlantınızı kontrol edin.';
      case 400:
        return 'Geçersiz istek. Lütfen girdiğiniz bilgileri kontrol edin.';
      case 401:
        return 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.';
      case 403:
        return 'Bu işlem için yetkiniz yok.';
      case 404:
        return 'İstenen kaynak bulunamadı.';
      case 409:
        return 'Bu işlem veri çakışmasına neden oluyor.';
      case 422:
        return 'İşlem gerçekleştirilemedi. İş kuralı ihlali.';
      case 500:
        return 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.';
      default:
        return error.message || 'Beklenmeyen bir hata oluştu.';
    }
  }

  /**
   * Nesnenin ProblemDetail formatında olup olmadığını kontrol eder
   */
  private static isProblemDetail(obj: any): obj is ProblemDetail {
    return obj && 
           typeof obj === 'object' && 
           ('type' in obj || 'title' in obj || 'detail' in obj);
  }

  /**
   * Tam hata detaylarını konsola yazdırır (development için)
   */
  static logError(error: HttpErrorResponse, context?: string): void {
    console.group(`🔴 HTTP Error ${context ? `(${context})` : ''}`);
    console.error('Status:', error.status);
    console.error('Status Text:', error.statusText);
    console.error('URL:', error.url);
    
    if (error.error && this.isProblemDetail(error.error)) {
      const problem = error.error as ProblemDetail;
      console.error('Problem Detail:', {
        type: problem.type,
        title: problem.title,
        detail: problem.detail,
        instance: problem.instance,
        timestamp: problem.timestamp,
        traceId: problem.traceId
      });
      
      if (problem.errors) {
        console.error('Field Errors:', problem.errors);
      }
      
      if (problem.rootCause) {
        console.error('Root Cause:', problem.rootCause);
      }
    } else {
      console.error('Error Body:', error.error);
    }
    
    console.groupEnd();
  }
}
