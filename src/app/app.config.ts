import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { provideAnimations } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from 'src/app/core/interceptors/auth.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    // Zone optimizasyonu (opsiyonel ama önerilir)
    provideZoneChangeDetection({ eventCoalescing: true }), 

    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])), // Bearer Token

    // Animasyonlar (ör. modal, collapse, toast vs.)
    provideAnimations(),

    // ng - bootstrap bileşenleri(navbar, modal, dropdown, tooltip ...)    
    importProvidersFrom(NgbModule), 
    // NgModule(NgbModule, HttpClientModule, FormsModule)'u standalone app'e dönüştürür. Standalone mimari kullanıyorum ama elimde hâlâ NgModule yapısında bir kütüphane var. O zaman bu modülü importProvidersFrom() ile projeye dahil ed.
    
    // provideNgb() 
    //@ng-bootstrap/ng-bootstrap@18.0.0 sürümü, Angular 18 desteğiyle geldi ama hala provideNgb() fonksiyonunu export etmiyor.




  ]
};
