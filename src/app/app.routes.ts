
import { Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from "./features/auth/login/login.component";
import { UnauthorizedComponent} from "./features/errors/unauthorized/unauthorized.component";
import { authGuard } from './core/guards/auth.guard';


export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        canActivate: [authGuard],

        children: [
            { path: '', component: HomeComponent },
            { 
                path: 'kullanici', 
                loadChildren: () => import('./features/kullanici/kullanici-route').then(m => m.KULLANICI_ROUTES)
            },
            { 
                path: 'videoders', 
                loadChildren: () => import('./features/videoders/videoders-route').then(m => m.VIDEODERS_ROUTES)
            },
            // { path: 'about', loadComponent: () => import('./features/about/about.component').then(m => m.AboutComponent) }
        ],
    },
    { path: 'login', component: LoginComponent },
    { path: 'unauthorized', component: UnauthorizedComponent },
    { path: '**', redirectTo: '' },
];