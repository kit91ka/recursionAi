import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { CategoriesService } from '../../core/api';
import { NAME_VALIDATION_DEBOUNCE_MS } from '../../core/config/constants';
import { CategoryEditDialog } from './category-edit.dialog';
import { CategoriesStore } from './categories.store';

describe('CategoryEditDialog', () => {
  let fixture: ComponentFixture<CategoryEditDialog>;
  let component: CategoryEditDialog;
  let api: jasmine.SpyObj<CategoriesService>;
  let router: jasmine.SpyObj<Router>;
  let store: CategoriesStore;

  beforeEach(async () => {
    api = jasmine.createSpyObj<CategoriesService>('CategoriesService', [
      'getById',
      'add',
      'update',
      'nameExists',
      'getAll',
    ]);
    api.nameExists.and.returnValue(of(false) as any);
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CategoryEditDialog],
      providers: [
        provideNoopAnimations(),
        CategoriesStore,
        { provide: CategoriesService, useValue: api },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryEditDialog);
    component = fixture.componentInstance;
    store = TestBed.inject(CategoriesStore);
  });

  it('is in Add mode without id and creates a category on save', fakeAsync(() => {
    api.add.and.returnValue(of(42) as any);
    fixture.detectChanges();

    expect(component.isEdit()).toBeFalse();
    component.nameCtrl.setValue('Fresh');
    tick(NAME_VALIDATION_DEBOUNCE_MS);

    component.save();

    expect(api.add).toHaveBeenCalledWith({ zidiumWebServiceFrontEditCategoryDto: { name: 'Fresh' } });
    expect(store.items().some((c) => c.id === 42 && c.name === 'Fresh')).toBeTrue();
    expect(router.navigate).toHaveBeenCalledWith(['/categories']);
  }));

  it('is in Edit mode with id, loads the record and updates on save', fakeAsync(() => {
    api.getById.and.returnValue(of({ id: 5, name: 'Old' }) as any);
    api.update.and.returnValue(of(undefined) as any);
    fixture.componentRef.setInput('id', '5');
    fixture.detectChanges();

    expect(component.isEdit()).toBeTrue();
    expect(component.nameCtrl.value).toBe('Old');

    component.nameCtrl.setValue('Updated');
    tick(NAME_VALIDATION_DEBOUNCE_MS);
    component.save();

    expect(api.update).toHaveBeenCalledWith({
      id: 5,
      zidiumWebServiceFrontEditCategoryDto: { name: 'Updated' },
    });
    expect(router.navigate).toHaveBeenCalledWith(['/categories']);
  }));

  it('does not save an invalid (empty) form', () => {
    fixture.detectChanges();
    component.save();
    expect(api.add).not.toHaveBeenCalled();
  });

  it('close navigates back to the list', () => {
    fixture.detectChanges();
    component.close();
    expect(component.visible()).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/categories']);
  });
});
