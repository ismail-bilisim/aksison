import { Routes } from '@angular/router';
import { EtkinlikOrganizasyonListPageComponent } from './pages/etkinlikorganizasyon-list-page/etkinlikorganizasyon-list-page.component';
import { EtkinlikOrganizasyonEditPageComponent } from './pages/etkinlikorganizasyon-edit-page/etkinlikorganizasyon-edit-page.component';
import { EtkinlikOrganizasyonDetailPageComponent } from './pages/etkinlikorganizasyon-detail-page/etkinlikorganizasyon-detail-page.component';
import { EtkinlikOrganizasyonBasvuruPageComponent } from './pages/etkinlikorganizasyon-basvuru-page/etkinlikorganizasyon-basvuru-page.component';

export const ETKINLIKORGANIZASYON_ROUTES: Routes = [
  { path: '', component: EtkinlikOrganizasyonListPageComponent },
  { path: 'new', component: EtkinlikOrganizasyonEditPageComponent },
  { path: 'by-durum/:durum', component: EtkinlikOrganizasyonListPageComponent },
  { path: 'edit/:id', component: EtkinlikOrganizasyonEditPageComponent },
  { path: 'detail/:id', component: EtkinlikOrganizasyonDetailPageComponent },
  { path: 'basvuru/:id', component: EtkinlikOrganizasyonBasvuruPageComponent },
  { path: ':id', redirectTo: 'detail/:id', pathMatch: 'full' }
];
