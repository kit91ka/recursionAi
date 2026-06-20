import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FluidModule } from 'primeng/fluid';

import { ZidiumWebServiceFrontCategoryDto } from '../../core/api/model/zidiumWebServiceFrontCategoryDto.model';
import { CategoriesStore } from './categories.store';
import { nameExistsValidator } from '../../shared/validators/name-exists.validator';

@Component({
  selector: 'app-category-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    FluidModule,
  ],
  templateUrl: './category-edit.dialog.html',
  styleUrl: './category-edit.dialog.scss',
})
export class CategoryEditDialog {
  private readonly ref = inject(DynamicDialogRef);
  private readonly location = inject(Location);
  readonly config = inject(DynamicDialogConfig);

  readonly item: ZidiumWebServiceFrontCategoryDto | null = this.config.data?.item ?? null;
  readonly store: CategoriesStore = this.config.data?.store;
  readonly canEdit = this.item?.canEdit ?? true;
  readonly isAdd = !this.item;
  readonly id = this.item?.id ?? null;

  readonly form = new FormGroup({
    name: new FormControl(this.item?.name ?? '', {
      nonNullable: true,
      validators: [Validators.required],
      asyncValidators: [nameExistsValidator(this.id)],
    }),
  });

  save(): void {
    if (this.form.invalid || this.form.pending) return;
    const name = this.form.getRawValue().name;
    this.ref.close();
    this.store.save(name, this.id ?? undefined).subscribe();
    this.location.replaceState('/categories');
  }

  close(): void {
    this.ref.close();
    this.location.replaceState('/categories');
  }
}
