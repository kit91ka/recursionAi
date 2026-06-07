import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { AuthService } from './auth.service';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let auth: jasmine.SpyObj<AuthService> & { token: string | null };

  beforeEach(() => {
    auth = jasmine.createSpyObj<AuthService>('AuthService', ['refresh', 'logout']) as any;
    (auth as any).token = 'access-token';

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: auth },
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('adds Authorization header to backend requests', () => {
    http.get('/front/categories').subscribe();

    const req = httpMock.expectOne('/front/categories');
    expect(req.request.headers.get('Authorization')).toBe('Bearer access-token');
    req.flush({});
  });

  it('does not add Authorization to logon endpoint', () => {
    http.post('/front/logon', {}).subscribe();

    const req = httpMock.expectOne('/front/logon');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });

  it('on 401 refreshes the token and retries the original request', (done) => {
    auth.refresh.and.returnValue(of({ token: 'new-token', refreshToken: 'r' }) as any);

    http.get('/front/categories').subscribe((res) => {
      expect(res).toEqual({ ok: true });
      done();
    });

    httpMock.expectOne('/front/categories').flush('unauthorized', {
      status: 401,
      statusText: 'Unauthorized',
    });

    const retry = httpMock.expectOne('/front/categories');
    expect(retry.request.headers.get('Authorization')).toBe('Bearer new-token');
    retry.flush({ ok: true });

    expect(auth.refresh).toHaveBeenCalledTimes(1);
  });

  it('logs out when refresh fails', (done) => {
    auth.refresh.and.returnValue(throwError(() => new Error('refresh failed')));

    http.get('/front/categories').subscribe({
      error: () => {
        expect(auth.logout).toHaveBeenCalled();
        done();
      },
    });

    httpMock.expectOne('/front/categories').flush('unauthorized', {
      status: 401,
      statusText: 'Unauthorized',
    });
  });
});
