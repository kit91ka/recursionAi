import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FluidModule } from 'primeng/fluid';
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

  readonly form = new FormGroup({
    login: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  loading = false;
  readonly serverError = signal<string | null>(null);

  submit(): void {
    if (this.form.invalid || this.loading) return;
    this.loading = true;
    this.serverError.set(null);

    this.authService.logon(this.form.value.login!, this.form.value.password!).subscribe({
      next: () => this.router.navigate(['/categories']),
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.serverError.set(err.error?.detail ?? 'Login failed');
      },
    });
  }
}
