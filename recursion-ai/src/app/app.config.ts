import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { ConfirmationService, MessageService } from 'primeng/api';

import { routes } from './app.routes';
import { ZidiumPreset } from './core/config/theme';
import { authInterceptor } from './core/auth/auth.interceptor';
import { environment } from './core/config/environment';
import { BASE_PATH } from './core/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: ZidiumPreset,
        options: {
          darkModeSelector: false,
        },
      },
    }),
    MessageService,
    ConfirmationService,
    { provide: BASE_PATH, useValue: environment.apiBaseUrl },
  ],
};
