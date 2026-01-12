import { Routes } from '@angular/router';
import { EgitmenListPageComponent } from './pages/egitmen-list-page/egitmen-list-page.component';
import { EgitmenEditPageComponent } from './pages/egitmen-edit-page/egitmen-edit-page.component';
import { EgitmenDetailPageComponent } from './pages/egitmen-detail-page/egitmen-detail-page.component';

export const EGITMEN_ROUTES: Routes = [
  { path: '', component: EgitmenListPageComponent }, // /egitmen - all egitmenler
  { path: 'new', component: EgitmenEditPageComponent }, // /egitmen/new
  { path: 'edit/:id', component: EgitmenEditPageComponent }, // /egitmen/edit/:id
  { path: 'by-onay/:onayKodu', component: EgitmenListPageComponent }, // /egitmen/by-onay/tas or ons or red
  { path: 'by-aktif/:aktifMi', component: EgitmenListPageComponent }, // /egitmen/by-aktif/false
  { path: 'detail/:id', component: EgitmenDetailPageComponent }, // /egitmen/detail/:id
  { path: ':id', redirectTo: 'detail/:id', pathMatch: 'full' }, // Redirect /egitmen/:id to /egitmen/detail/:id
];
