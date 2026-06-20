import { inject } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, Observable, of, switchMap } from 'rxjs';
import { CategoriesService } from '../../core/api/api/categories.service';
import { NAME_VALIDATOR_DEBOUNCE } from '../../core/config/constants';

export function nameExistsValidator(currentId: number | null): AsyncValidatorFn {
  const api = inject(CategoriesService);

  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const name = control.value?.trim();
    if (!name) return of(null);

    return of(name).pipe(
      debounceTime(NAME_VALIDATOR_DEBOUNCE),
      distinctUntilChanged(),
      switchMap((n) => api.nameExists(n, currentId ?? undefined)),
      map((exists) => (exists ? { nameTaken: true } : null)),
    );
  };
}
