import {
  afterRenderEffect,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ConfirmationService } from 'primeng/api';

import { CategoriesService } from '../../core/api';
import { Category } from '../../core/api-types';
import { INFINITE_SCROLL_PREFETCH_PX, SEARCH_DEBOUNCE_MS } from '../../core/config/constants';
import { CategoriesStore } from './categories.store';

@Component({
  selector: 'app-categories-list-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    RouterOutlet,
    ButtonModule,
    TableModule,
    InputTextModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './categories-list.page.html',
  styleUrl: './categories-list.page.scss',
})
export class CategoriesListPage implements OnInit, AfterViewInit, OnDestroy {
  private readonly store = inject(CategoriesStore);
  private readonly api = inject(CategoriesService);
  private readonly confirm = inject(ConfirmationService);
  private readonly destroyRef = inject(DestroyRef);

  readonly items = this.store.items;
  readonly canEdit = this.store.canEdit;
  readonly loading = this.store.loading;
  readonly sortDesc = this.store.sortDesc;
  readonly isEmpty = this.store.isEmpty;

  readonly searchControl = new FormControl('', { nonNullable: true });

  private readonly sentinel = viewChild<ElementRef<HTMLElement>>('sentinel');
  private observer?: IntersectionObserver;

  constructor() {
    // Догрузка, пока контент не заполнил вьюпорт: после каждого рендера, если
    // сентинел всё ещё близко к низу окна, тянем следующую страницу.
    afterRenderEffect(() => this.autoFillViewport());
  }

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(SEARCH_DEBOUNCE_MS),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((value) => this.store.setSearch(value));

    this.store.reload();
  }

  ngAfterViewInit(): void {
    const el = this.sentinel()?.nativeElement;
    if (!el) {
      return;
    }
    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          this.store.loadNextPage();
        }
      },
      { rootMargin: `${INFINITE_SCROLL_PREFETCH_PX}px` },
    );
    this.observer.observe(el);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private autoFillViewport(): void {
    const el = this.sentinel()?.nativeElement;
    if (!el || this.loading() || !this.store.hasMore()) {
      return;
    }
    if (el.getBoundingClientRect().top <= window.innerHeight + INFINITE_SCROLL_PREFETCH_PX) {
      this.store.loadNextPage();
    }
  }

  toggleSort(): void {
    this.store.toggleSort();
  }

  confirmDelete(category: Category, event: Event): void {
    event.stopPropagation();
    this.confirm.confirm({
      header: 'Confirmation',
      message: 'Sure to delete this element?',
      acceptLabel: 'Delete',
      rejectLabel: 'Close',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => this.deleteCategory(category.id),
    });
  }

  private deleteCategory(id: number): void {
    this.api._delete({ id }).subscribe(() => this.store.removeFromList(id));
  }
}
