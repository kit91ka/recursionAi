import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { CategoriesService } from '../../core/api';
import { Category } from '../../core/api-types';
import { PAGE_SIZE } from '../../core/config/constants';
import { finalize, Subscription } from 'rxjs';

/**
 * Signal-стор справочника категорий: пагинация скроллом, поиск, сортировка,
 * иммутабельные upsert/remove. Источник истины для списка и модалок.
 */
@Injectable({ providedIn: 'root' })
export class CategoriesStore {
  private readonly api = inject(CategoriesService);
  private readonly destroyRef = inject(DestroyRef);

  readonly items = signal<Category[]>([]);
  readonly canEdit = signal(false);
  readonly search = signal('');
  readonly sortDesc = signal(false);
  readonly loading = signal(false);
  readonly hasMore = signal(true);

  private pageNumber = 0;
  private loadSub?: Subscription;

  readonly isEmpty = computed(() => !this.loading() && this.items().length === 0);

  /** Сброс пагинации и загрузка первой страницы. */
  reload(): void {
    // Отменяем запрос в полёте и снимаем loading, иначе гард в loadNextPage
    // заблокирует свежую загрузку, а устаревший ответ затрёт список.
    this.loadSub?.unsubscribe();
    this.pageNumber = 0;
    this.items.set([]);
    this.hasMore.set(true);
    this.loading.set(false);
    this.loadNextPage();
  }

  /** Догрузка следующей страницы (защита от гонок через loading/hasMore). */
  loadNextPage(): void {
    if (this.loading() || !this.hasMore()) {
      return;
    }
    this.loading.set(true);

    const search = this.search().trim();
    this.loadSub = this.api
      .getAll({
        search: search || undefined,
        pageSize: PAGE_SIZE,
        pageNumber: this.pageNumber,
        sortDesc: this.sortDesc(),
      })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((res) => {
        this.items.update((curr) => [...curr, ...res.items]);
        this.canEdit.set(res.canEdit);
        this.hasMore.set(res.items.length === PAGE_SIZE);
        this.pageNumber++;
      });
  }

  setSearch(value: string): void {
    if (value === this.search()) {
      return;
    }
    this.search.set(value);
    this.reload();
  }

  toggleSort(): void {
    this.sortDesc.update((desc) => !desc);
    this.reload();
  }

  removeFromList(id: number): void {
    this.items.update((items) => items.filter((item) => item.id !== id));
  }

  /** Иммутабельное добавление/обновление записи в списке. */
  upsert(category: Category): void {
    this.items.update((items) => {
      const index = items.findIndex((item) => item.id === category.id);
      if (index === -1) {
        return [...items, category];
      }
      const copy = [...items];
      copy[index] = category;
      return copy;
    });
  }
}
