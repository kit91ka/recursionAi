import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { TokenStorage } from './token-storage.service';
import { AuthService } from './auth.service';

const SKIP_PATHS = ['/front/logon'];

let isRefreshing = false;
const refreshQueue = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenStorage = inject(TokenStorage);
  const authService = inject(AuthService);

  const isAuthRequest = SKIP_PATHS.some((p) => req.url.includes(p));

  const reqWithAuth = isAuthRequest
    ? req
    : req.clone({ setHeaders: { Authorization: `Bearer ${tokenStorage.token()}` } });

  return next(reqWithAuth).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401 || isAuthRequest) {
        return throwError(() => error);
      }

      if (!isRefreshing) {
        isRefreshing = true;
        refreshQueue.next(null);

        return authService.refresh().pipe(
          switchMap((newToken) => {
            isRefreshing = false;
            refreshQueue.next(newToken);
            return next(req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } }));
          }),
          catchError((err) => {
            isRefreshing = false;
            refreshQueue.next(null);
            return throwError(() => err);
          }),
        );
      }

      return refreshQueue.pipe(
        filter((token) => token !== null),
        take(1),
        switchMap((token) =>
          next(req.clone({ setHeaders: { Authorization: `Bearer ${token!}` } })),
        ),
      );
    }),
  );
};
