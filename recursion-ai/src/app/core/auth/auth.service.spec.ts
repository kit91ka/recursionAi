import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { LogonService } from '../api';
import { AuthService } from './auth.service';
import { TokenStorage } from './token-storage';

describe('AuthService', () => {
  let auth: AuthService;
  let logon: jasmine.SpyObj<LogonService>;
  let router: jasmine.SpyObj<Router>;
  let storage: TokenStorage;

  beforeEach(() => {
    localStorage.clear();
    logon = jasmine.createSpyObj<LogonService>('LogonService', [
      'logon',
      'refreshToken',
      'getCurrentUser',
    ]);
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        TokenStorage,
        { provide: LogonService, useValue: logon },
        { provide: Router, useValue: router },
      ],
    });
    auth = TestBed.inject(AuthService);
    storage = TestBed.inject(TokenStorage);
  });

  afterEach(() => localStorage.clear());

  it('logon stores tokens and current user', (done) => {
    logon.logon.and.returnValue(
      of({ token: 't', refreshToken: 'r', user: { displayName: 'Ann', timezoneOffset: '0' } }) as any,
    );

    auth.logon('test', '77777').subscribe(() => {
      expect(storage.token()).toBe('t');
      expect(auth.currentUser()?.displayName).toBe('Ann');
      expect(auth.isAuthenticated()).toBeTrue();
      done();
    });
  });

  it('logon propagates error and does not store tokens', (done) => {
    logon.logon.and.returnValue(throwError(() => new Error('bad creds')));

    auth.logon('x', 'y').subscribe({
      error: () => {
        expect(storage.token()).toBeNull();
        expect(auth.isAuthenticated()).toBeFalse();
        done();
      },
    });
  });

  it('refresh updates the token pair', (done) => {
    storage.setTokens('old', 'oldR');
    logon.refreshToken.and.returnValue(of({ token: 'new', refreshToken: 'newR' }) as any);

    auth.refresh().subscribe(() => {
      expect(storage.token()).toBe('new');
      expect(storage.refreshToken).toBe('newR');
      done();
    });
  });

  it('logout clears storage and redirects to /login', () => {
    storage.setTokens('t', 'r');
    auth.logout();

    expect(storage.token()).toBeNull();
    expect(auth.currentUser()).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
