import { Routes } from '@angular/router';
import {PaydasDetailPageComponent} from './pages/paydas-detail-page/paydas-detail-page.component';
import { PaydasEditPageComponent } from './pages/paydas-edit-page/paydas-edit-page.component';
import { PaydasListPageComponent } from './pages/paydas-list-page/paydas-list-page.component';

export const PAYDAS_ROUTES: Routes = [
    { path: 'new', component: PaydasEditPageComponent },
    { path: 'detail/:id', component: PaydasDetailPageComponent },
    { path: 'edit/:id', component: PaydasEditPageComponent },
    { path: 'all-ozet', component: PaydasListPageComponent }
];
