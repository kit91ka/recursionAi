import { Component, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FluidModule } from 'primeng/fluid';

import { ZidiumWebServiceFrontCategoryDto } from '../../core/api/model/zidiumWebServiceFrontCategoryDto.model';
import { nameExistsValidator } from '../../shared/validators/name-exists.validator';

@Component({
  selector: 'app-category-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    FluidModule,
  ],
  templateUrl: './category-edit.dialog.html',
  styleUrl: './category-edit.dialog.scss',
})
export class CategoryEditDialog {
  private readonly ref = inject(DynamicDialogRef);
  readonly config = inject(DynamicDialogConfig);
  readonly saved = signal(false);

  readonly item: ZidiumWebServiceFrontCategoryDto | null = this.config.data?.item ?? null;
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

  constructor() {
    effect(() => {
      if (this.saved()) {
        this.ref.close({ name: this.form.getRawValue().name });
      }
    });
  }

  save(): void {
    if (this.form.invalid) return;
    this.saved.set(true);
  }

  close(): void {
    this.ref.close();
  }
}
