import { Injectable, inject, signal } from '@angular/core';
import { catchError, finalize, map, Observable, of, switchMap, tap } from 'rxjs';
import { CategoriesService } from '../../core/api/api/categories.service';
import { ZidiumWebServiceFrontCategoryDto } from '../../core/api/model/zidiumWebServiceFrontCategoryDto.model';
import { ZidiumWebServiceFrontEditCategoryDto } from '../../core/api/model/zidiumWebServiceFrontEditCategoryDto.model';
import { PAGE_SIZE } from '../../core/config/constants';

@Injectable({ providedIn: 'root' })
export class CategoriesStore {
  private readonly api = inject(CategoriesService);

  readonly items = signal<ZidiumWebServiceFrontCategoryDto[]>([]);
  readonly canEdit = signal(true);
  readonly search = signal('');
  readonly sortDesc = signal(false);
  readonly loading = signal(false);
  readonly hasMore = signal(true);
  readonly error = signal<string | null>(null);

  private pageNumber = 0;

  loadPage(): Observable<void> {
    if (this.loading() || !this.hasMore()) {
      return of(undefined);
    }

    this.loading.set(true);
    this.error.set(null);

    return this.api
      .getAll(this.search() || undefined, PAGE_SIZE, this.pageNumber, this.sortDesc())
      .pipe(
        tap((res) => {
          this.canEdit.set(res.canAdd ?? true);
          const newItems = res.items ?? [];
          if (this.pageNumber === 0) {
            this.items.set(newItems);
          } else {
            this.items.update((prev) => [...prev, ...newItems]);
          }
          this.hasMore.set(newItems.length >= PAGE_SIZE);
          this.pageNumber++;
        }),
        map(() => undefined),
        catchError((err) => {
          this.error.set(err.error?.detail ?? 'Failed to load categories');
          return of(undefined);
        }),
        finalize(() => this.loading.set(false)),
      );
  }

  setSearch(value: string): void {
    this.search.set(value);
    this.reset();
  }

  toggleSort(): void {
    this.sortDesc.update((v) => !v);
    this.reset();
  }

  save(name: string, id?: number): Observable<void> {
    const dto: ZidiumWebServiceFrontEditCategoryDto = { name };
    const req$ = id != null ? this.api.update(id, dto) : this.api.add(dto);
    return req$.pipe(
      tap(() => {
        this.items.set([]);
        this.pageNumber = 0;
        this.hasMore.set(true);
        this.loadPage().subscribe();
      }),
      map(() => undefined),
      catchError((err) => {
        this.error.set(err.error?.detail ?? 'Failed to save category');
        return of(undefined);
      }),
    );
  }

  remove(item: ZidiumWebServiceFrontCategoryDto): Observable<void> {
    this.removeFromList(item.id);
    return this.api._delete(item.id).pipe(
      tap(() => {
        if (this.items().length === 0 && this.pageNumber > 0) {
          this.reset();
          this.loadPage().subscribe();
        }
      }),
      map(() => undefined),
      catchError((err) => {
        this.error.set(err.error?.detail ?? 'Failed to delete category');
        this.items.update((prev) => [item, ...prev]);
        return of(undefined);
      }),
    );
  }

  upsert(item: ZidiumWebServiceFrontCategoryDto): void {
    this.items.update((prev) => {
      const idx = prev.findIndex((i) => i.id === item.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = item;
        return copy;
      }
      return [item, ...prev];
    });
  }

  removeFromList(id: number): void {
    this.items.update((prev) => prev.filter((i) => i.id !== id));
  }

  private reset(): void {
    this.pageNumber = 0;
    this.items.set([]);
    this.hasMore.set(true);
  }
}
