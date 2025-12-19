import { Routes } from '@angular/router';
import { DersEditPageComponent } from './pages/ders-edit-page/ders-edit-page.component';
import { DersDetailPageComponent } from './pages/ders-detail-page/ders-detail-page.component';
import { DersListPageComponent } from './pages/ders-list-page/ders-list-page.component';
import { unsavedChangesGuard } from '../../core/guards/unsaved-changes.guard';

export const DERS_ROUTES: Routes = [
  { path: '', component: DersListPageComponent },
  { path: 'new', component: DersEditPageComponent, canDeactivate: [unsavedChangesGuard] },
  { path: 'by-onay/:onayDurumu', component: DersListPageComponent },
  { path: 'edit/:id', component: DersEditPageComponent, canDeactivate: [unsavedChangesGuard] },
  { path: 'detail/:id', component: DersDetailPageComponent },
];
