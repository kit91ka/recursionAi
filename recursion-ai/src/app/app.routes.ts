import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'categories', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'categories',
    loadComponent: () => import('./features/layout/shell.layout').then((m) => m.ShellLayout),
    canMatch: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/categories/categories.page').then((m) => m.CategoriesPage),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./features/categories/categories.page').then((m) => m.CategoriesPage),
      },
    ],
  },
];
