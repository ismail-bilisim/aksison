import { Routes } from '@angular/router';
import { PaydasDetailPageComponent } from './pages/paydas-detail-page/paydas-detail-page.component';
import { PaydasEditPageComponent } from './pages/paydas-edit-page/paydas-edit-page.component';
import { PaydasListPageComponent } from './pages/paydas-list-page/paydas-list-page.component';
import { unsavedChangesGuard } from '../../core/guards/unsaved-changes.guard';

export const PAYDAS_ROUTES: Routes = [
    { path: '', component: PaydasListPageComponent },
    { path: 'new', component: PaydasEditPageComponent, canDeactivate: [unsavedChangesGuard] },
    { path: 'by-onay/:onayDurumu', component: PaydasListPageComponent },
    { path: 'edit/:id', component: PaydasEditPageComponent, canDeactivate: [unsavedChangesGuard] },
    { path: 'detail/:id', component: PaydasDetailPageComponent },
    { path: ':id', component: PaydasDetailPageComponent }
];
