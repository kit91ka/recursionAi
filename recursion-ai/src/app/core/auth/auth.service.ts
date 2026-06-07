import { HttpContext } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { CurrentUserDto, LogonService } from '../api';
import { SKIP_ERROR_TOAST } from '../http/error.interceptor';
import { TokenStorage } from './token-storage';

/**
 * Управление сессией: вход, обновление токена, выход, текущий пользователь.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly logonApi = inject(LogonService);
  private readonly storage = inject(TokenStorage);
  private readonly router = inject(Router);

  private readonly _currentUser = signal<CurrentUserDto | null>(null);
  readonly currentUser = this._currentUser.asReadonly();

  /** Авторизован, если есть access-token. */
  readonly isAuthenticated = computed(() => this.storage.token() !== null);

  /** Текущий токен (для interceptor). */
  get token(): string | null {
    return this.storage.token();
  }

  logon(login: string, password: string): Observable<unknown> {
    // Ошибку входа показывает сама форма (inline под полем Password), поэтому
    // запрос помечен SKIP_ERROR_TOAST — глобальный errorInterceptor его не трогает.
    const context = new HttpContext().set(SKIP_ERROR_TOAST, true);
    return this.logonApi
      .logon({ logonRequestDto: { login, password } }, 'body', false, { context })
      .pipe(
        tap((res) => {
          this.storage.setTokens(res.token, res.refreshToken);
          this._currentUser.set(res.user);
        }),
      );
  }

  /** Обновление пары токенов по refresh-токену. */
  refresh(): Observable<{ token: string; refreshToken: string }> {
    const refreshToken = this.storage.refreshToken;
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    return this.logonApi
      .refreshToken({ refreshTokenRequestDto: { refreshToken } })
      .pipe(tap((res) => this.storage.setTokens(res.token, res.refreshToken)));
  }

  loadCurrentUser(): Observable<CurrentUserDto> {
    return this.logonApi.getCurrentUser().pipe(tap((user) => this._currentUser.set(user)));
  }

  logout(): void {
    this.storage.clear();
    this._currentUser.set(null);
    void this.router.navigate(['/login']);
  }
}
