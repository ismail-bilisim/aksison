import { Routes } from '@angular/router';
import { TalepListComponent } from './components/talep-list/talep-list.component';
import { TalepKanbanComponent } from './components/talep-kanban/talep-kanban.component';
import { TalepListPageComponent } from './pages/talep-list-page/talep-list-page.component';
import { TalepEditPageComponent } from './pages/talep-edit-page/talep-edit-page.component';
import { TalepDetailPageComponent } from './pages/talep-detail-page/talep-detail-page.component';
import { TalepOnayBekleyenPageComponent } from './pages/talep-list-onay-page/talep-list-onay-page.component';

export const TALEP_ROUTES: Routes = [
  { path: '', component: TalepListPageComponent }, // /talep - default list
  { path: 'new', component: TalepEditPageComponent }, // /talep/new
  { path: 'edit/:id', component: TalepEditPageComponent }, // /talep/edit/:id
  { path: 'kanban', component: TalepKanbanComponent }, // /talep/kanban
  { path: 'by-onay/:onayKodu', component: TalepOnayBekleyenPageComponent }, // /talep/onay-bekleyen - Onay bekleyenler
  { path: 'by-durumu/:durumKodu', component: TalepListComponent }, // /talep/by-durumu/acik
  { path: 'bana-atanan', component: TalepListComponent }, // /talep/bana-atanan (will need a resolver or current user id)
  { path: 'detail/:id', component: TalepDetailPageComponent }, // /talep/detail/:id
  { path: ':id', redirectTo: 'detail/:id', pathMatch: 'full' }, // Redirect /talep/:id to /talep/detail/:id
];