import { TestBed } from '@angular/core/testing';

import { STORAGE_KEYS } from '../config/constants';
import { TokenStorage } from './token-storage';

describe('TokenStorage', () => {
  let storage: TokenStorage;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    storage = TestBed.inject(TokenStorage);
  });

  afterEach(() => localStorage.clear());

  it('persists tokens and exposes access token via signal', () => {
    storage.setTokens('access', 'refresh');

    expect(storage.token()).toBe('access');
    expect(storage.refreshToken).toBe('refresh');
    expect(localStorage.getItem(STORAGE_KEYS.token)).toBe('access');
  });

  it('clears tokens', () => {
    storage.setTokens('access', 'refresh');
    storage.clear();

    expect(storage.token()).toBeNull();
    expect(storage.refreshToken).toBeNull();
  });
});
