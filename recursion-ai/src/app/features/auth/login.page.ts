import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpContext, HttpErrorResponse } from '@angular/common/http';
import { SKIP_ERROR_TOAST } from '../../core/http/error.interceptor';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FluidModule } from 'primeng/fluid';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    FluidModule,
  ],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
})
export class LoginPage {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly form = new FormGroup({
    login: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  loading = signal(false);

  constructor() {
    this.form.controls.password.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (this.form.controls.password.hasError('serverError')) {
          const errors = { ...this.form.controls.password.errors };
          delete errors['serverError'];
          this.form.controls.password.setErrors(
            Object.keys(errors).length > 0 ? errors : null
          );
        }
      });
  }

  submit(): void {
    if (this.form.invalid || this.loading()) return;
    this.loading.set(true);

    const skipToast = new HttpContext().set(SKIP_ERROR_TOAST, true);
    this.authService.logon(this.form.value.login!, this.form.value.password!, skipToast)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => this.router.navigate(['/categories']),
        error: (err: HttpErrorResponse) => {
          this.form.controls.password.setErrors({ serverError: err.error?.detail ?? 'Login failed' });
        },
      });
  }
}
