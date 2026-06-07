import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';

import { AuthService } from './auth.service';

/** Single-flight состояние обновления токена, общее на все параллельные запросы. */
let isRefreshing = false;
const refreshedToken$ = new BehaviorSubject<string | null>(null);

/** Эндпоинты авторизации не требуют Bearer и не запускают refresh-петлю. */
function isAuthEndpoint(url: string): boolean {
  return url.includes('/front/logon');
}

function withToken(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
}

/**
 * Функциональный интерсептор: добавляет Authorization, на 401 обновляет токен
 * (single-flight) и повторяет исходный запрос; при провале refresh — logout.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  if (isAuthEndpoint(req.url)) {
    return next(req);
  }

  const token = auth.token;
  const authReq = token ? withToken(req, token) : req;

  return next(authReq).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401 && token) {
        return handle401(req, next, auth);
      }
      return throwError(() => error);
    }),
  );
};

function handle401(
  req: HttpRequest<unknown>,
  next: Parameters<HttpInterceptorFn>[1],
  auth: AuthService,
) {
  if (isRefreshing) {
    // Ждём завершения текущего refresh, затем повторяем с новым токеном.
    return refreshedToken$.pipe(
      filter((t): t is string => t !== null),
      take(1),
      switchMap((newToken) => next(withToken(req, newToken))),
    );
  }

  isRefreshing = true;
  refreshedToken$.next(null);

  return auth.refresh().pipe(
    switchMap((tokens) => {
      isRefreshing = false;
      refreshedToken$.next(tokens.token);
      return next(withToken(req, tokens.token));
    }),
    catchError((error: unknown) => {
      isRefreshing = false;
      auth.logout();
      return throwError(() => error);
    }),
  );
}
