import { HttpContextToken, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, EMPTY, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';

export const SKIP_ERROR_TOAST = new HttpContextToken<boolean>(() => false);

const DEFAULT_ERROR = 'An error occurred. Please try again.';

function extractMessage(error: HttpErrorResponse): string {
  const body: unknown = error.error;

  if (typeof body === 'string' && body.trim()) {
    return body;
  }

  if (body && typeof body === 'object') {
    const record = body as Record<string, unknown>;
    const candidate = record['detail'] ?? record['message'] ?? record['title'];
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate;
    }
  }

  return error.statusText?.trim() || DEFAULT_ERROR;
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messages = inject(MessageService);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (req.context.get(SKIP_ERROR_TOAST) || !(error instanceof HttpErrorResponse)) {
        return throwError(() => error);
      }

      messages.add({
        severity: 'error',
        summary: 'Error',
        detail: extractMessage(error),
      });
      return EMPTY;
    }),
  );
};
