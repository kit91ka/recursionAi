import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormControl, ValidationErrors } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Observable } from 'rxjs';
import { nameExistsValidator } from './name-exists.validator';

describe('nameExistsValidator', () => {
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  function createValidator(currentId: number | null): ReturnType<typeof nameExistsValidator> {
    return TestBed.runInInjectionContext(() => nameExistsValidator(currentId));
  }

  function validate(
    validator: ReturnType<typeof nameExistsValidator>,
    control: FormControl,
  ): Observable<ValidationErrors | null> {
    return validator(control) as Observable<ValidationErrors | null>;
  }

  it('should return null for empty value', () => {
    const validator = createValidator(null);
    const control = new FormControl('');

    validate(validator, control).subscribe((errors) => {
      expect(errors).toBeNull();
    });
  });

  it('should return null for whitespace-only value', () => {
    const validator = createValidator(null);
    const control = new FormControl('   ');

    validate(validator, control).subscribe((errors) => {
      expect(errors).toBeNull();
    });
  });

  it('should return null when name is not taken', fakeAsync(() => {
    const validator = createValidator(null);
    const control = new FormControl('UniqueName');

    let actual: ValidationErrors | null | undefined;
    validate(validator, control).subscribe((errors) => {
      actual = errors;
    });

    tick(400); // debounce
    const req = httpMock.expectOne((r) => r.url.includes('/name-exists'));
    expect(req.request.params.get('name')).toBe('UniqueName');
    req.flush(false);
    tick();

    expect(actual).toBeNull();
  }));

  it('should return nameTaken when name already exists', fakeAsync(() => {
    const validator = createValidator(null);
    const control = new FormControl('ExistingName');

    let actual: ValidationErrors | null | undefined;
    validate(validator, control).subscribe((errors) => {
      actual = errors;
    });

    tick(400); // debounce
    httpMock.expectOne((r) => r.url.includes('/name-exists')).flush(true);
    tick();

    expect(actual).toEqual({ nameTaken: true });
  }));

  it('should pass currentId as query param to exclude self', fakeAsync(() => {
    const validator = createValidator(5);
    const control = new FormControl('MyName');

    validate(validator, control).subscribe();
    tick(400);

    const req = httpMock.expectOne((r) => r.url.includes('/name-exists'));
    expect(req.request.params.get('id')).toBe('5');
    req.flush(false);
  }));
});
