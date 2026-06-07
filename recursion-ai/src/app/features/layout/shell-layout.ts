import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';

/**
 * Каркасный лейаут авторизованной зоны: статичное левое меню (78px) + контент.
 * Меню вне CRUD (по ТЗ), сделано каркасно под макет.
 */
@Component({
  selector: 'app-shell-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
  templateUrl: './shell-layout.html',
  styleUrl: './shell-layout.scss',
})
export class ShellLayout {
  private readonly auth = inject(AuthService);

  readonly userName = this.auth.currentUser;

  logout(): void {
    this.auth.logout();
  }
}
