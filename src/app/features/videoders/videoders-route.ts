import { Routes } from '@angular/router';
import { VideodersEditPageComponent } from './pages/videoders-edit-page/videoders-edit-page.component';
import { VideodersDetailPageComponent } from './pages/videoders-detail-page/videoders-detail-page.component';
import { VideodersListPageComponent } from './pages/videoders-list-page/videoders-list-page.component';

export const VIDEODERS_ROUTES: Routes = [
  { path: '', component: VideodersListPageComponent },
  { path: 'new', component: VideodersEditPageComponent },
  { path: 'by-durum/:durum', component: VideodersListPageComponent },
  { path: 'edit/:kodu', component: VideodersEditPageComponent },
  { path: 'detail/:kodu', component: VideodersDetailPageComponent },
];