import { Component, inject, ElementRef, viewChild, afterRenderEffect, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { CategoriesStore } from './categories.store';
import { CategoryEditDialog } from './category-edit.dialog';
import { ZidiumWebServiceFrontCategoryDto } from '../../core/api/model/zidiumWebServiceFrontCategoryDto.model';
import { SEARCH_DEBOUNCE } from '../../core/config/constants';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    ProgressSpinnerModule,
    ButtonModule,
    RouterLink,
    ConfirmDialogModule,
  ],
  templateUrl: './categories.page.html',
  styleUrl: './categories.page.scss',
})
export class CategoriesPage implements OnInit {
  readonly store = inject(CategoriesStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialogService = inject(DialogService);
  private readonly confirmationService = inject(ConfirmationService);

  readonly sentinel = viewChild<ElementRef<HTMLElement>>('sentinel');

  searchValue = '';
  private search$ = new Subject<string>();

  readonly columns = [
    { field: 'id', header: 'Id' },
    { field: 'name', header: 'Name' },
  ];

  private io: IntersectionObserver | null = null;

  constructor() {
    this.search$
      .pipe(debounceTime(SEARCH_DEBOUNCE), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((value) => {
        this.store.setSearch(value);
        this.store.loadPage().subscribe();
      });

    this.io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && this.canLoadMore()) {
          this.store.loadPage().subscribe();
        }
      },
      { rootMargin: '200px' },
    );

    afterRenderEffect(() => {
      const el = this.sentinel()?.nativeElement;
      if (el) {
        this.io?.disconnect();
        this.io?.observe(el);
      }
    });

    this.route.queryParams.pipe(takeUntilDestroyed()).subscribe((params) => {
      if (params['action'] === 'add') {
        this.openDialog(null);
      }
    });

    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const id = params.get('id');
      if (id && id !== '') {
        this.openDialog(Number(id));
      }
    });
  }

  openAddDialog(): void {
    this.openDialog(null);
  }

  ngOnInit(): void {
    this.store.loadPage().subscribe();
  }

  onSort(): void {
    this.store.toggleSort();
    this.store.loadPage().subscribe();
  }

  onSearch(value: string): void {
    this.searchValue = value;
    this.search$.next(value);
  }

  clearSearch(): void {
    this.searchValue = '';
    this.search$.next('');
  }

  openDialog(itemOrId: ZidiumWebServiceFrontCategoryDto | number | null): void {
    const item = typeof itemOrId === 'number' ? null : itemOrId;
    const id = typeof itemOrId === 'number' ? itemOrId : null;

    const dialogRef = this.dialogService.open(CategoryEditDialog, {
      header: item ? 'Edit Category' : 'Add Category',
      width: '600px',
      modal: true,
      closable: true,
      dismissableMask: true,
      data: { item, id, store: this.store },
    });

    if (!dialogRef) return;

    // Диалог сам управляет сохранением и очисткой URL.
    // onClose не используется — DynamicDialogRef.close() не эмитит onClose в этой версии PrimeNG.
  }

  confirmDelete(item: ZidiumWebServiceFrontCategoryDto): void {
    this.confirmationService.confirm({
      message: 'Sure to delete this element?',
      header: 'Confirmation',
      acceptButtonProps: { severity: 'danger', label: 'Delete' },
      rejectButtonProps: { label: 'Close', severity: 'secondary' },
      accept: () => {
        this.store.remove(item).subscribe();
      },
    });
  }

  onRowClick(item: ZidiumWebServiceFrontCategoryDto): void {
    this.router.navigate(['/categories', item.id]);
  }

  private canLoadMore(): boolean {
    return this.store.hasMore() && !this.store.loading();
  }
}
