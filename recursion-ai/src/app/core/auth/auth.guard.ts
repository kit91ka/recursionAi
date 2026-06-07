import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';

import { AuthService } from './auth.service';

/**
 * Пускает только авторизованных. Иначе — редирект на /login.
 * CanMatch не даёт даже загрузить защищённые маршруты для неавторизованных.
 */
export const authGuard: CanMatchFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isAuthenticated() ? true : router.parseUrl('/login');
};
