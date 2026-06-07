import { fakeAsync, tick } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { CategoriesService } from '../../core/api';
import { NAME_VALIDATION_DEBOUNCE_MS } from '../../core/config/constants';
import { nameExistsValidator } from './name-exists.validator';

describe('nameExistsValidator', () => {
  let api: jasmine.SpyObj<CategoriesService>;

  beforeEach(() => {
    api = jasmine.createSpyObj<CategoriesService>('CategoriesService', ['nameExists']);
  });

  function run(value: string, currentId: number | null) {
    const control = new FormControl(value);
    const validator = nameExistsValidator(api, () => currentId);
    let result: unknown = 'pending';
    (validator(control) as any).subscribe((r: unknown) => (result = r));
    return () => result;
  }

  it('returns null for empty value without hitting the API', fakeAsync(() => {
    const get = run('', null);
    tick(NAME_VALIDATION_DEBOUNCE_MS);
    expect(get()).toBeNull();
    expect(api.nameExists).not.toHaveBeenCalled();
  }));

  it('returns nameTaken error when the name exists', fakeAsync(() => {
    api.nameExists.and.returnValue(of(true) as any);
    const get = run('used', null);
    tick(NAME_VALIDATION_DEBOUNCE_MS);
    expect(get()).toEqual({ nameTaken: true });
  }));

  it('returns null when the name is free', fakeAsync(() => {
    api.nameExists.and.returnValue(of(false) as any);
    const get = run('free', 5);
    tick(NAME_VALIDATION_DEBOUNCE_MS);
    expect(get()).toBeNull();
    expect(api.nameExists.calls.mostRecent().args[0]).toEqual({ name: 'free', id: 5 });
  }));

  it('swallows API errors and treats the name as valid', fakeAsync(() => {
    api.nameExists.and.returnValue(throwError(() => new Error('network')));
    const get = run('x', null);
    tick(NAME_VALIDATION_DEBOUNCE_MS);
    expect(get()).toBeNull();
  }));
});
