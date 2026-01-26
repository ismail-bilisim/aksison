import { Routes } from '@angular/router';
import { TalepKanbanPageComponent } from './pages/talep-kanban-page/talep-kanban-page.component';
import { TalepListTumPageComponent } from './pages/talep-list-tum-page/talep-list-tum-page.component';
import { TalepEditPageComponent } from './pages/talep-edit-page/talep-edit-page.component';
import { TalepDetailPageComponent } from './pages/talep-detail-page/talep-detail-page.component';
import { TalepOnayBekleyenPageComponent } from './pages/talep-list-onay-page/talep-list-onay-page.component';
import { TalepListAtananPageComponent } from './pages/talep-list-atanan-page/talep-list-atanan-page.component';
import { TalepListDurumPageComponent } from './pages/talep-list-durum-page/talep-list-durum-page.component';
import { TalepStatsPageComponent } from './pages/talep-stats-page/talep-stats-page.component';

export const TALEP_ROUTES: Routes = [
  { path: '', component: TalepListTumPageComponent }, // /talep - default list
  { path: 'new', component: TalepEditPageComponent }, // /talep/new
  { path: 'edit/:id', component: TalepEditPageComponent }, // /talep/edit/:id
  { path: 'kanban', component: TalepKanbanPageComponent }, // /talep/kanban
  { path: 'stats', component: TalepStatsPageComponent }, // /talep/stats
  { path: 'by-onay/:onayKodu', component: TalepOnayBekleyenPageComponent }, // /talep/onay-bekleyen - Onay bekleyenler
  { path: 'by-durum/:durumKodu', component: TalepListDurumPageComponent }, // /talep/by-durum/:durumKodu
  { path: 'bana-atanan', component: TalepListAtananPageComponent }, // /talep/bana-atanan (will need a resolver or current user id)
  { path: 'detail/:id', component: TalepDetailPageComponent }, // /talep/detail/:id
  { path: ':id', redirectTo: 'detail/:id', pathMatch: 'full' }, // Redirect /talep/:id to /talep/detail/:id
];