import { Routes } from '@angular/router';
import { SoruListPageComponent } from './pages/soru-list-page/soru-list-page.component';
import { SoruDetailPageComponent } from './pages/soru-detail-page/soru-detail-page.component';
import { SoruEditPageComponent } from './pages/soru-edit-page/soru-edit-page.component';
import { unsavedChangesGuard } from 'src/app/core/guards/unsaved-changes.guard';

export const SORU_ROUTES: Routes = [
  { path: '', component: SoruListPageComponent },
  { path: 'new', component: SoruEditPageComponent, canDeactivate: [unsavedChangesGuard] },
  { path: 'edit/:id', component: SoruEditPageComponent, canDeactivate: [unsavedChangesGuard] },
  { path: 'detail/:id', component: SoruDetailPageComponent },
];
