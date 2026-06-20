import { Injectable, signal } from '@angular/core';

const TOKEN_KEY = 'zidium_token';
const REFRESH_KEY = 'zidium_refresh';
const USER_KEY = 'zidium_user';

@Injectable({ providedIn: 'root' })
export class TokenStorage {
  readonly token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  readonly refreshToken = signal<string | null>(localStorage.getItem(REFRESH_KEY));
  readonly userName = signal<string | null>(localStorage.getItem(USER_KEY));

  get isAuthenticated(): boolean {
    return !!this.token();
  }

  setTokens(token: string, refreshToken: string, user: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(REFRESH_KEY, refreshToken);
    localStorage.setItem(USER_KEY, user);
    this.token.set(token);
    this.refreshToken.set(refreshToken);
    this.userName.set(user);
  }

  clear(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
    this.token.set(null);
    this.refreshToken.set(null);
    this.userName.set(null);
  }
}
