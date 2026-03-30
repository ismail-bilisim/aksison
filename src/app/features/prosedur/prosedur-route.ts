import { Routes } from '@angular/router';
import { ProsedurListPageComponent } from './pages/prosedur-list-page/prosedur-list-page.component';
import { ProsedurEditPageComponent } from './pages/prosedur-edit-page/prosedur-edit-page.component';
import { ProsedurDetailPageComponent } from './pages/prosedur-detail-page/prosedur-detail-page.component';
import { ProsedurListByTurPageComponent } from './pages/prosedur-list-bytur-page/prosedur-list-bytur-page.component';

export const PROSEDUR_ROUTES: Routes = [
  { path: '', component: ProsedurListPageComponent },
  { path: 'new', component: ProsedurEditPageComponent },
  { path: 'by-durum/:durum', component: ProsedurListPageComponent },
  { path: 'by-tur/:surecTuruKodu', component: ProsedurListByTurPageComponent },
  { path: 'edit/:id', component: ProsedurEditPageComponent },
  { path: 'detail/:id', component: ProsedurDetailPageComponent },
  { path: ':id', redirectTo: 'detail/:id', pathMatch: 'full' }
];
