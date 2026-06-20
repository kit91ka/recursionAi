import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ShellLayout } from './shell.layout';
import { AuthService } from '../../core/auth/auth.service';
import { TokenStorage } from '../../core/auth/token-storage.service';

describe('ShellLayout', () => {
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['logout']);

    await TestBed.configureTestingModule({
      imports: [ShellLayout],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService },
        {
          provide: TokenStorage,
          useValue: { userName: 'Test User' },
        },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ShellLayout);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should expose userName from TokenStorage', () => {
    const fixture = TestBed.createComponent(ShellLayout);
    expect(fixture.componentInstance.userName).toBe('Test User');
  });

  it('should call authService.logout on logout()', () => {
    const fixture = TestBed.createComponent(ShellLayout);
    fixture.componentInstance.logout();
    expect(authService.logout).toHaveBeenCalledTimes(1);
  });
});
