import { Routes } from '@angular/router';
import { YuzyuzedersEditPageComponent } from './pages/yuzyuzeders-edit-page/yuzyuzeders-edit-page.component';
import { YuzyuzedersDetailPageComponent } from './pages/yuzyuzeders-detail-page/yuzyuzeders-detail-page.component';
import { YuzyuzedersListPageComponent } from './pages/yuzyuzeders-list-page/yuzyuzeders-list-page.component';
import { YuzyuzedersListOnayPageComponent } from './pages/yuzyuzeders-list-onay-page/yuzyuzeders-list-onay-page.component';

export const YUZYUZEDERS_ROUTES: Routes = [
  { path: '', component: YuzyuzedersListPageComponent },
  { path: 'all-ozet', component: YuzyuzedersListPageComponent },
  { path: 'new', component: YuzyuzedersEditPageComponent },
  { path: 'by-durum/:durum', component: YuzyuzedersListPageComponent },
  { path: 'by-onay/:onayKodu', component: YuzyuzedersListOnayPageComponent },
  { path: 'edit/:id', component: YuzyuzedersEditPageComponent },
  { path: 'detail/:id', component: YuzyuzedersDetailPageComponent },
  { path: ':id', redirectTo: 'detail/:id', pathMatch: 'full' }
];
