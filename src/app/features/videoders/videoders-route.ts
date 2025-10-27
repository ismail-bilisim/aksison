import { Routes } from '@angular/router';
import { VideodersListPageComponent } from './pages/videoders-list-page/videoders-list-page.component';
import { VideodersEditPageComponent } from './pages/videoders-edit-page/videoders-edit-page.component';
import { VideodersDetailComponent } from './components/videoders-detail/videoders-detail.component';
import { VideodersByProjeYoneticisiPageComponent } from './pages/videoders-by-proje-yoneticisi-page/videoders-by-proje-yoneticisi-page.component';
import { VideodersByMateryalGelistiriciPageComponent } from './pages/videoders-by-materyal-gelistirici-page/videoders-by-materyal-gelistirici-page.component';

export const VIDEODERS_ROUTES: Routes = [
  { path: '', component: VideodersListPageComponent },
  { path: 'new', component: VideodersEditPageComponent },
  { path: 'edit/:kodu', component: VideodersEditPageComponent },
  { path: 'detail/:kodu', component: VideodersDetailComponent },
  { path: 'by-proje-yoneticisi', component: VideodersByProjeYoneticisiPageComponent },
  { path: 'by-materyal-gelistirici', component: VideodersByMateryalGelistiriciPageComponent }
];