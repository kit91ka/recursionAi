import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { catchError, first, map, Observable, of, switchMap, timer } from 'rxjs';

import { CategoriesService } from '../../core/api';
import { NAME_VALIDATION_DEBOUNCE_MS } from '../../core/config/constants';

/**
 * Асинхронный валидатор уникальности имени категории.
 * GET /front/categories/name-exists?id=&name= → true означает «занято».
 * Debounce + switchMap (отмена предыдущего запроса), пустое имя пропускаем (его ловит required).
 *
 * @param api сгенерированный CategoriesService
 * @param getCurrentId id текущей записи (Edit) или null (Add)
 */
export function nameExistsValidator(
  api: CategoriesService,
  getCurrentId: () => number | null,
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const name = (control.value ?? '').trim();
    if (!name) {
      return of(null);
    }

    const id = getCurrentId();
    return timer(NAME_VALIDATION_DEBOUNCE_MS).pipe(
      switchMap(() => api.nameExists({ name, id: id ?? undefined })),
      map((exists) => (exists ? { nameTaken: true } : null)),
      catchError(() => of(null)),
      first(),
    );
  };
}
