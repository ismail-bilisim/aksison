// kullanici.routes.ts (standalone)
import { Routes } from '@angular/router';
import { KullaniciListPageComponent } from './pages/kullanici-list-page/kullanici-list-page.component';
import { KullaniciEditPageComponent } from './pages/kullanici-edit-page/kullanici-edit-page.component';
import { KullaniciDetailPageComponent } from './pages/kullanici-detail-page/kullanici-detail-page.component';

export const KULLANICI_ROUTES: Routes = [
  { path: '', component: KullaniciListPageComponent },
  { path: 'yeni', component: KullaniciEditPageComponent },
  { path: ':id', component: KullaniciDetailPageComponent },
  { path: ':id/duzenle', component: KullaniciEditPageComponent },
];