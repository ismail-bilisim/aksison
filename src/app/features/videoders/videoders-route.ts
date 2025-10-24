import { Routes } from '@angular/router';
import { VideodersListPageComponent } from './pages/videoders-list-page/videoders-list-page.component';
import { VideodersEditPageComponent } from './pages/videoders-edit-page/videoders-edit-page.component';
import { VideodersDetailComponent } from './components/videoders-detail/videoders-detail.component';

export const VIDEODERS_ROUTES: Routes = [
  { path: '', component: VideodersListPageComponent },
  { path: 'new', component: VideodersEditPageComponent },
  { path: 'edit/:kodu', component: VideodersEditPageComponent },
  { path: 'detail/:kodu', component: VideodersDetailComponent }

];