import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { LoginPage } from './login.page';
import { By } from '@angular/platform-browser';

describe('LoginPage', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPage, NoopAnimationsModule],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(LoginPage);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have form with login and password controls', () => {
    const fixture = TestBed.createComponent(LoginPage);
    expect(fixture.componentInstance.form.contains('login')).toBeTrue();
    expect(fixture.componentInstance.form.contains('password')).toBeTrue();
  });

  it('should have invalid form when fields are empty', () => {
    const fixture = TestBed.createComponent(LoginPage);
    expect(fixture.componentInstance.form.invalid).toBeTrue();
  });

  it('should not submit when form is invalid', () => {
    const fixture = TestBed.createComponent(LoginPage);
    fixture.componentInstance.submit();
    expect(fixture.componentInstance.loading).toBeFalse();
  });

  it('should show server error message', () => {
    const fixture = TestBed.createComponent(LoginPage);
    fixture.componentInstance.serverError.set('Invalid credentials');
    fixture.detectChanges();

    const errorEl = fixture.debugElement.query(By.css('.server-error'));
    expect(errorEl).toBeTruthy();
    expect(errorEl.nativeElement.textContent).toContain('Invalid credentials');
  });

  it('should render Logon button', () => {
    const fixture = TestBed.createComponent(LoginPage);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Logon');
  });
});
