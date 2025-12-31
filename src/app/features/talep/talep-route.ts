import { Routes } from '@angular/router';
import { TalepFormComponent } from './components/talep-form/talep-form.component';
import { TalepListComponent } from './components/talep-list/talep-list.component';
import { TalepKanbanComponent } from './components/talep-kanban/talep-kanban.component';
import { TalepTemelComponent } from './components/talep-temel/talep-temel.component';
import { TalepListPageComponent } from './pages/talep-list-page/talep-list-page.component';
import { TalepEditPageComponent } from './pages/talep-edit-page/talep-edit-page.component';
import { TalepDetailPageComponent } from './pages/talep-detail-page/talep-detail-page.component';

export const TALEP_ROUTES: Routes = [
  { path: '', component: TalepListPageComponent }, // /talep
  { path: 'new', component: TalepEditPageComponent }, // /talep/new
  { path: 'kanban', component: TalepKanbanComponent }, // /talep/kanban
  { path: 'by-durumu/:durumKodu', component: TalepListComponent }, // /talep/by-durumu/acik
  { path: 'by-atanan/:kullaniciId', component: TalepListComponent }, // /talep/by-atanan/me (will need a resolver or current user id)
  { path: 'edit/:id', component: TalepEditPageComponent }, // /talep/edit/:id
  { path: 'detail/:id', component: TalepDetailPageComponent }, // /talep/detail/:id
  { path: ':id', redirectTo: 'detail/:id', pathMatch: 'full' }, // Redirect /talep/:id to /talep/detail/:id
];