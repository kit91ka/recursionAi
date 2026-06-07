import {
  HttpClient,
  HttpContext,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';

import { errorInterceptor, SKIP_ERROR_TOAST } from './error.interceptor';

describe('errorInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let messages: jasmine.SpyObj<MessageService>;

  beforeEach(() => {
    messages = jasmine.createSpyObj<MessageService>('MessageService', ['add']);
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        { provide: MessageService, useValue: messages },
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('shows a toast with the error detail and swallows the stream', () => {
    let nexted = false;
    let errored = false;
    let completed = false;
    http.get('/x').subscribe({
      next: () => (nexted = true),
      error: () => (errored = true),
      complete: () => (completed = true),
    });

    httpMock
      .expectOne('/x')
      .flush({ detail: 'Boom happened' }, { status: 500, statusText: 'Server Error' });

    expect(messages.add).toHaveBeenCalledWith(
      jasmine.objectContaining({ severity: 'error', detail: 'Boom happened' }),
    );
    expect(nexted).toBeFalse();
    expect(errored).toBeFalse();
    expect(completed).toBeTrue();
  });

  it('falls back to statusText when no message in body', () => {
    http.get('/x').subscribe({ error: () => undefined });
    httpMock.expectOne('/x').flush(null, { status: 503, statusText: 'Service Unavailable' });

    expect(messages.add).toHaveBeenCalledWith(
      jasmine.objectContaining({ detail: 'Service Unavailable' }),
    );
  });

  it('does not toast and rethrows when SKIP_ERROR_TOAST is set', () => {
    let errored = false;
    http
      .get('/y', { context: new HttpContext().set(SKIP_ERROR_TOAST, true) })
      .subscribe({ error: () => (errored = true) });

    httpMock.expectOne('/y').flush(null, { status: 500, statusText: 'Server Error' });

    expect(messages.add).not.toHaveBeenCalled();
    expect(errored).toBeTrue();
  });
});
