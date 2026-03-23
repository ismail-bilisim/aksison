import { Routes } from '@angular/router';
import { CanlidersEditPageComponent } from './pages/canliders-edit-page/canliders-edit-page.component';
import { CanlidersDetailPageComponent } from './pages/canliders-detail-page/canliders-detail-page.component';
import { CanlidersListPageComponent } from './pages/canliders-list-page/canliders-list-page.component';
import { CanlidersBasvuruPageComponent } from './pages/canliders-basvuru-page/canliders-basvuru-page.component';

export const CANLIDERS_ROUTES: Routes = [
  { path: '', component: CanlidersListPageComponent },
  { path: 'all-ozet', component: CanlidersListPageComponent },
  { path: 'new', component: CanlidersEditPageComponent },
  { path: 'by-durum/:durum', component: CanlidersListPageComponent },
  { path: 'edit/:id', component: CanlidersEditPageComponent },
  { path: 'detail/:id', component: CanlidersDetailPageComponent },
  { path: 'basvuru/:id', component: CanlidersBasvuruPageComponent },
  { path: ':id', redirectTo: 'detail/:id', pathMatch: 'full' }
];
