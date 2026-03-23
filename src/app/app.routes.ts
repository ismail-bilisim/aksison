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
            { 
                path: 'yuzyuzeders', 
                loadChildren: () => import('./features/yuzyuzeders/yuzyuze-route').then(m => m.YUZYUZEDERS_ROUTES)
            },
            { 
                path: 'canliders', 
                loadChildren: () => import('./features/canliders/canliders-route').then(m => m.CANLIDERS_ROUTES)
            },
            { 
                path: 'ders', 
                loadChildren: () => import('./features/ders/ders-route').then(m => m.DERS_ROUTES)
            },
            {
                path: 'soru',
                loadChildren: () => import('./features/soru/soru-route').then(m => m.SORU_ROUTES)
            },
            {
                path: 'kategori',
                loadChildren: () => import('./features/kategori/kategori-route').then(m => m.KATEGORI_ROUTES)
            },
            {
                path: 'paydas',
                loadChildren: () => import('./features/paydas/paydas-route').then(m => m.PAYDAS_ROUTES)
            },
            {
                path: 'proje',
                loadChildren: () => import('./features/proje/proje-route').then(m => m.PROJE_ROUTES)
            },
            {
                path: 'talep',
                loadChildren: () => import('./features/talep/talep-route').then(m => m.TALEP_ROUTES)
            },
            {
                path: 'egitmen',
                loadChildren: () => import('./features/egitmen/egitmen-route').then(m => m.EGITMEN_ROUTES)
            },
            // { path: 'about', loadComponent: () => import('./features/about/about.component').then(m => m.AboutComponent) }
        ],
    },
    { path: 'login', component: LoginComponent },
    { path: 'unauthorized', component: UnauthorizedComponent },
    { path: '**', redirectTo: '' },
];