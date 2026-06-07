import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

import { AuthService } from '../../core/auth/auth.service';

const DEFAULT_LOGIN_ERROR = 'Не удалось войти. Проверьте логин и пароль.';

@Component({
  selector: 'app-login-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, PasswordModule],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly loading = signal(false);
  readonly serverError = signal<string | null>(null);
  readonly submitted = signal(false);

  readonly form = this.fb.nonNullable.group({
    login: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor() {
    // Сбрасываем серверную ошибку, как только пользователь правит форму.
    this.form.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.serverError.set(null));
  }

  submit(): void {
    this.submitted.set(true);
    this.serverError.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const { login, password } = this.form.getRawValue();

    this.auth.logon(login, password).subscribe({
      next: () => {
        this.loading.set(false);
        void this.router.navigateByUrl('/categories');
      },
      error: (err: unknown) => {
        this.loading.set(false);
        this.serverError.set(this.extractError(err));
      },
    });
  }

  private extractError(err: unknown): string {
    if (err instanceof HttpErrorResponse) {
      // Текст ошибки берём из поля detail ответа (RFC 7807), затем fallback.
      const message = err.error?.detail ?? err.error?.message ?? err.error?.title;
      if (typeof message === 'string' && message.trim()) {
        return message;
      }
    }
    return DEFAULT_LOGIN_ERROR;
  }
}
