import { Routes } from '@angular/router';
import {PaydasDetailPageComponent} from './pages/paydas-detail-page/paydas-detail-page.component';

export const PAYDAS_ROUTES: Routes = [
    { path: ':id', component: PaydasDetailPageComponent }
];
