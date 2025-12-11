import { Routes } from '@angular/router';

export const KATEGORI_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./pages/kategori-list-page/kategori-list-page.component')
                .then(m => m.KategoriListPageComponent)
    },
    {
        path: 'suzgec',
        loadComponent: () =>
            import('./pages/kategori-filter-page/kategori-filter-page.component')
                .then(m => m.KategoriFilterPageComponent)
    }
];
