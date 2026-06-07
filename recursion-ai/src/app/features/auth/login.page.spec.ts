import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { LoginPage } from './login.page';

describe('LoginPage', () => {
  let fixture: ComponentFixture<LoginPage>;
  let component: LoginPage;
  let auth: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    auth = jasmine.createSpyObj<AuthService>('AuthService', ['logon']);
    router = jasmine.createSpyObj<Router>('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [LoginPage],
      providers: [
        provideNoopAnimations(),
        { provide: AuthService, useValue: auth },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('shows "Field is required" and does not call logon on empty submit', () => {
    component.submit();
    fixture.detectChanges();

    expect(auth.logon).not.toHaveBeenCalled();
    const errors = fixture.nativeElement.querySelectorAll('.login-field__error');
    expect(errors.length).toBe(2);
  });

  it('calls logon and navigates on valid submit', () => {
    auth.logon.and.returnValue(of({}) as any);
    component.form.setValue({ login: 'test', password: '77777' });

    component.submit();

    expect(auth.logon).toHaveBeenCalledWith('test', '77777');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/categories');
  });

  it('shows server error message from API response', () => {
    auth.logon.and.returnValue(
      throwError(() => new HttpErrorResponse({ status: 403, error: { message: 'User is blocked' } })),
    );
    component.form.setValue({ login: 'test', password: 'x' });

    component.submit();
    fixture.detectChanges();

    expect(component.serverError()).toBe('User is blocked');
  });
});
