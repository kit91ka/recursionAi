import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

import { CategoriesService } from '../../core/api';
import { nameExistsValidator } from '../../shared/validators/name-exists.validator';
import { CategoriesStore } from './categories.store';

@Component({
  selector: 'app-category-edit-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, ButtonModule, DialogModule, InputTextModule],
  templateUrl: './category-edit.dialog.html',
})
export class CategoryEditDialog implements OnInit {
  private readonly api = inject(CategoriesService);
  private readonly store = inject(CategoriesStore);
  private readonly router = inject(Router);

  /** Привязывается из route param ':id' (для /categories/new — undefined). */
  readonly id = input<string>();

  readonly editId = computed(() => {
    const raw = this.id();
    const num = raw != null ? Number(raw) : NaN;
    return Number.isInteger(num) ? num : null;
  });
  readonly isEdit = computed(() => this.editId() !== null);
  readonly canEdit = this.store.canEdit;

  readonly visible = signal(true);
  readonly saving = signal(false);
  readonly loading = signal(false);

  readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
      asyncValidators: [nameExistsValidator(this.api, () => this.editId())],
    }),
  });

  readonly nameCtrl = this.form.controls.name;

  ngOnInit(): void {
    const id = this.editId();
    if (id === null) {
      return;
    }
    this.loading.set(true);
    // Ошибку загрузки покажет глобальный errorInterceptor (toast); loading снимаем в finalize.
    this.api.getById({ id })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((category) => this.nameCtrl.setValue(category.name));
  }

  save(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }
    const name = this.nameCtrl.getRawValue().trim();
    const id = this.editId();
    this.saving.set(true);
    id !== null ? this.editCategory(id, name) : this.createCategory(name);
  }

  private editCategory(id: number, name: string): void {
    this.api
      .update({ id, zidiumWebServiceFrontEditCategoryDto: { name } })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe(() => {
        this.store.upsert({ id, name });
        this.close();
      });
  }

  private createCategory(name: string): void {
    this.api
      .add({ zidiumWebServiceFrontEditCategoryDto: { name } })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe((newId) => {
        this.store.upsert({ id: newId, name });
        this.close();
      });
  }

  close(): void {
    this.visible.set(false);
    void this.router.navigate(['/categories']);
  }
}
