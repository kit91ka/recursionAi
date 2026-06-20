import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CategoryEditDialog } from './category-edit.dialog';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';

describe('CategoryEditDialog', () => {
  let ref: jasmine.SpyObj<DynamicDialogRef>;

  function createDialog(configData: any) {
    TestBed.overrideProvider(DynamicDialogConfig, {
      useValue: { data: configData },
    });
    return TestBed.createComponent(CategoryEditDialog);
  }

  beforeEach(() => {
    ref = jasmine.createSpyObj<DynamicDialogRef>('DynamicDialogRef', ['close']);

    TestBed.configureTestingModule({
      imports: [CategoryEditDialog, NoopAnimationsModule],
      providers: [
        { provide: DynamicDialogRef, useValue: ref },
        {
          provide: DynamicDialogConfig,
          useValue: { data: { item: null, id: null, store: {} } },
        },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(CategoryEditDialog);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show Add Category mode when no item', () => {
    const fixture = TestBed.createComponent(CategoryEditDialog);
    fixture.detectChanges();
    expect(fixture.componentInstance.isAdd).toBeTrue();
    expect(fixture.componentInstance.item).toBeNull();
  });

  it('should show Edit Category mode when item exists', () => {
    const fixture = createDialog({
      item: { id: 5, name: 'Test', canEdit: true, canDelete: true },
      id: 5,
      store: {},
    });
    fixture.detectChanges();

    expect(fixture.componentInstance.isAdd).toBeFalse();
    expect(fixture.componentInstance.item?.id).toBe(5);
  });

  it('should display the id when editing', () => {
    const fixture = createDialog({
      item: { id: 5, name: 'Test', canEdit: true, canDelete: true },
      id: 5,
      store: {},
    });
    fixture.detectChanges();

    const idDisplay = fixture.debugElement.query(By.css('.id-display'));
    expect(idDisplay).toBeTruthy();
    expect(idDisplay.nativeElement.textContent.trim()).toBe('5');
  });

  it('should disable submit when form is invalid (empty name)', () => {
    const fixture = TestBed.createComponent(CategoryEditDialog);
    fixture.detectChanges();

    expect(fixture.componentInstance.form.invalid).toBeTrue();
  });

  it('should close dialog when close() is called', () => {
    const fixture = TestBed.createComponent(CategoryEditDialog);
    fixture.detectChanges();

    fixture.componentInstance.close();
    expect(ref.close).toHaveBeenCalled();
  });

  it('should close with name when save() with async validation succeeds', fakeAsync(() => {
    const fixture = TestBed.createComponent(CategoryEditDialog);
    fixture.detectChanges();

    fixture.componentInstance.form.get('name')?.setValue('ValidName');
    tick(400);

    const httpMock = TestBed.inject(HttpTestingController);
    httpMock.expectOne((r) => r.url.includes('/name-exists')).flush(false);
    tick();

    fixture.componentInstance.save();
    fixture.detectChanges(); // triggers effect()
    expect(ref.close).toHaveBeenCalledWith({ name: 'ValidName' });
  }));

  it('should show required error when name is empty and touched', () => {
    const fixture = TestBed.createComponent(CategoryEditDialog);
    fixture.detectChanges();

    const nameControl = fixture.componentInstance.form.get('name');
    nameControl?.markAsTouched();
    nameControl?.setValue('');
    fixture.detectChanges();

    const errorEl = fixture.debugElement.query(By.css('.p-error'));
    expect(errorEl).toBeTruthy();
    expect(errorEl.nativeElement.textContent).toContain('Field is required');
  });
});
