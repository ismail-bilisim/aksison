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
    },
    {
        path: 'detail/:id',
        loadComponent: () =>
            import('./pages/kategori-detail-page/kategori-detail-page.component')
                .then(m => m.KategoriDetailPageComponent)
    }
];
