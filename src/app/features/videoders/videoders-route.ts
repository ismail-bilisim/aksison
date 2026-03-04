import { Routes } from '@angular/router';
import { VideodersEditPageComponent } from './pages/videoders-edit-page/videoders-edit-page.component';
import { VideodersDetailPageComponent } from './pages/videoders-detail-page/videoders-detail-page.component';
import { VideodersListPageComponent } from './pages/videoders-list-page/videoders-list-page.component';
import { VideodersKanbanPageComponent } from './pages/videoders-kanban-page/videoders-kanban-page.component';

export const VIDEODERS_ROUTES: Routes = [
  { path: '', component: VideodersListPageComponent },
  { path: 'all-ozet', component: VideodersListPageComponent },
  { path: 'new', component: VideodersEditPageComponent },
  { path: 'kanban', component: VideodersKanbanPageComponent },
  { path: 'by-durum/:durum', component: VideodersListPageComponent },
  { path: 'edit/:id', component: VideodersEditPageComponent },
  { path: 'detail/:id', component: VideodersDetailPageComponent },
  { path: ':id', redirectTo: 'detail/:id', pathMatch: 'full' }
];