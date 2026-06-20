import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { TokenStorage } from '../../core/auth/token-storage.service';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './shell.layout.html',
  styleUrl: './shell.layout.scss',
})
export class ShellLayout {
  readonly userName = inject(TokenStorage).userName;
  private readonly authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }
}
