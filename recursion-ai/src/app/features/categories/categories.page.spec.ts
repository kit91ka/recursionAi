import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { CategoriesPage } from './categories.page';

describe('CategoriesPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesPage, NoopAnimationsModule],
      providers: [provideRouter([]), provideHttpClient(), ConfirmationService, DialogService],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(CategoriesPage);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have correct table columns', () => {
    const fixture = TestBed.createComponent(CategoriesPage);
    expect(fixture.componentInstance.columns).toEqual([
      { field: 'id', header: 'Id' },
      { field: 'name', header: 'Name' },
    ]);
  });

  it('should update searchValue on onSearch', () => {
    const fixture = TestBed.createComponent(CategoriesPage);
    fixture.componentInstance.onSearch('test');
    expect(fixture.componentInstance.searchValue).toBe('test');
  });

  it('should reset searchValue on clearSearch', () => {
    const fixture = TestBed.createComponent(CategoriesPage);
    fixture.componentInstance.onSearch('test');
    fixture.componentInstance.clearSearch();
    expect(fixture.componentInstance.searchValue).toBe('');
  });
});
