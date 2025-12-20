import { Routes } from '@angular/router';
import { ProjeDetailPageComponent } from './pages/proje-detail-page/proje-detail-page.component';
import { ProjeEditPageComponent } from './pages/proje-edit-page/proje-edit-page.component';
import { ProjeListPageComponent } from './pages/proje-list-page/proje-list-page.component';
import { unsavedChangesGuard } from '../../core/guards/unsaved-changes.guard';

export const PROJE_ROUTES: Routes = [
    { path: '', component: ProjeListPageComponent },
    { path: 'new', component: ProjeEditPageComponent, canDeactivate: [unsavedChangesGuard] },
    { path: 'by-onay/:onayDurumu', component: ProjeListPageComponent },
    { path: 'edit/:id', component: ProjeEditPageComponent, canDeactivate: [unsavedChangesGuard] },
    { path: 'detail/:id', component: ProjeDetailPageComponent },
    { path: ':id', component: ProjeDetailPageComponent }
];
