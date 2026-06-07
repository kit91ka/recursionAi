import { Injectable, signal } from '@angular/core';
import { STORAGE_KEYS } from '../config/constants';

/**
 * Хранилище JWT-токенов: localStorage + реактивный signal на access-token.
 */
@Injectable({ providedIn: 'root' })
export class TokenStorage {
  private readonly _token = signal<string | null>(this.read(STORAGE_KEYS.token));

  /** Реактивный access-token (для interceptor/guard). */
  readonly token = this._token.asReadonly();

  get refreshToken(): string | null {
    return this.read(STORAGE_KEYS.refreshToken);
  }

  setTokens(token: string, refreshToken: string): void {
    localStorage.setItem(STORAGE_KEYS.token, token);
    localStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken);
    this._token.set(token);
  }

  clear(): void {
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.refreshToken);
    this._token.set(null);
  }

  private read(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }
}
