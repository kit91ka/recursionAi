import { Routes } from '@angular/router';

import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.page').then((m) => m.LoginPage),
  },
  {
    path: '',
    canMatch: [authGuard],
    loadComponent: () =>
      import('./features/layout/shell-layout').then((m) => m.ShellLayout),
    children: [
      {
        path: 'categories',
        loadComponent: () =>
          import('./features/categories/categories-list.page').then(
            (m) => m.CategoriesListPage,
          ),
        children: [
          {
            path: 'new',
            loadComponent: () =>
              import('./features/categories/category-edit.dialog').then(
                (m) => m.CategoryEditDialog,
              ),
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./features/categories/category-edit.dialog').then(
                (m) => m.CategoryEditDialog,
              ),
          },
        ],
      },
      { path: '', redirectTo: 'categories', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '' },
];
