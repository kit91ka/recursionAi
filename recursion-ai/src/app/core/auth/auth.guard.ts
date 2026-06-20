import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { TokenStorage } from './token-storage.service';

export const authGuard: CanMatchFn = () => {
  const tokenStorage = inject(TokenStorage);
  if (tokenStorage.isAuthenticated) {
    return true;
  }
  return inject(Router).parseUrl('/login');
};
