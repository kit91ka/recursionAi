import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';

import { AuthService } from './auth.service';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  function setup(isAuth: boolean) {
    const auth = { isAuthenticated: () => isAuth } as Partial<AuthService>;
    const urlTree = new UrlTree();
    const router = { parseUrl: jasmine.createSpy('parseUrl').and.returnValue(urlTree) };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: auth },
        { provide: Router, useValue: router },
      ],
    });
    return { router, urlTree };
  }

  it('allows navigation when authenticated', () => {
    setup(true);
    const result = TestBed.runInInjectionContext(() => authGuard({} as any, []));
    expect(result).toBeTrue();
  });

  it('redirects to /login when not authenticated', () => {
    const { router, urlTree } = setup(false);
    const result = TestBed.runInInjectionContext(() => authGuard({} as any, []));
    expect(result).toBe(urlTree);
    expect(router.parseUrl).toHaveBeenCalledWith('/login');
  });
});
