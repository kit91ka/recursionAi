import { inject, Injectable } from '@angular/core';
import { HttpContext } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map, Observable, switchMap, tap, throwError } from 'rxjs';
import { LogonService } from '../api/api/logon.service';
import { TokenStorage } from './token-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly logonService = inject(LogonService);
  private readonly tokenStorage = inject(TokenStorage);
  private readonly router = inject(Router);

  readonly isAuthenticated = this.tokenStorage.token.asReadonly();

  logon(login: string, password: string, context?: HttpContext): Observable<void> {
    return this.logonService.logon({ login, password }, 'body', false, { context }).pipe(
      tap((res) => {
        this.tokenStorage.setTokens(res.token!, res.refreshToken!, res.user!.displayName!);
      }),
      map(() => undefined),
    );
  }

  refresh(): Observable<string> {
    const refreshToken = this.tokenStorage.refreshToken();
    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token'));
    }
    return this.logonService.refreshToken({ refreshToken }).pipe(
      tap((res) => {
        if (res.token && res.refreshToken) {
          this.tokenStorage.setTokens(
            res.token,
            res.refreshToken,
            this.tokenStorage.userName() ?? '',
          );
        }
      }),
      map((res) => res.token!),
      catchError((err) => {
        this.logout();
        return throwError(() => err);
      }),
    );
  }

  logout(): void {
    this.tokenStorage.clear();
    this.router.navigate(['/login']);
  }
}
