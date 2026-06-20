import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CategoriesStore } from './categories.store';
import { ZidiumWebServiceFrontCategoryListDto } from '../../core/api/model/zidiumWebServiceFrontCategoryListDto.model';
import { ZidiumWebServiceFrontCategoryDto } from '../../core/api/model/zidiumWebServiceFrontCategoryDto.model';

describe('CategoriesStore', () => {
  let store: CategoriesStore;
  let httpMock: HttpTestingController;

  const mockItem = (id: number, name: string): ZidiumWebServiceFrontCategoryDto => ({
    id,
    name,
    canEdit: true,
    canDelete: true,
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    store = TestBed.inject(CategoriesStore);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should have initial empty state', () => {
    expect(store.items()).toEqual([]);
    expect(store.canEdit()).toBeTrue();
    expect(store.search()).toBe('');
    expect(store.sortDesc()).toBeFalse();
    expect(store.loading()).toBeFalse();
    expect(store.hasMore()).toBeTrue();
    expect(store.error()).toBeNull();
  });

  describe('loadPage', () => {
    it('should load first page and set items', () => {
      const list: ZidiumWebServiceFrontCategoryListDto = {
        items: [mockItem(1, 'A'), mockItem(2, 'B')],
        canAdd: true,
      };

      let result: void | undefined;
      store.loadPage().subscribe((r) => (result = r));

      const req = httpMock.expectOne(
        (r) => r.method === 'GET' && r.url.endsWith('/front/categories'),
      );
      expect(req.request.params.get('pageSize')).toBe('10');
      expect(req.request.params.get('pageNumber')).toBe('0');
      req.flush(list);

      expect(result).toBeUndefined();
      expect(store.items()).toEqual(list.items);
      expect(store.canEdit()).toBeTrue();
      expect(store.hasMore()).toBeFalse(); // 2 < 10
      expect(store.loading()).toBeFalse();
      expect(store.error()).toBeNull();
    });

    it('should append items on subsequent pages', () => {
      const page0: ZidiumWebServiceFrontCategoryListDto = {
        items: Array.from({ length: 10 }, (_, i) => mockItem(i, `Item-${i}`)),
        canAdd: true,
      };

      store.loadPage().subscribe();
      httpMock.expectOne((r) => r.url.endsWith('/front/categories')).flush(page0);
      expect(store.items().length).toBe(10);
      expect(store.hasMore()).toBeTrue();

      const page1: ZidiumWebServiceFrontCategoryListDto = {
        items: [mockItem(10, 'Item-10')],
        canAdd: true,
      };

      store.loadPage().subscribe();
      httpMock.expectOne((r) => r.url.endsWith('/front/categories')).flush(page1);
      expect(store.items().length).toBe(11);
      expect(store.hasMore()).toBeFalse();
    });

    it('should skip loading when already loading', () => {
      store.loadPage().subscribe();

      // Second call should not trigger HTTP request
      let called = false;
      store.loadPage().subscribe(() => (called = true));

      httpMock.expectOne((r) => r.url.endsWith('/front/categories')); // only one request
      expect(called).toBeTrue();
    });

    it('should skip loading when hasMore is false', () => {
      store.loadPage().subscribe();
      httpMock
        .expectOne((r) => r.url.endsWith('/front/categories'))
        .flush({
          items: Array.from({ length: 10 }, (_, i) => mockItem(i, `Item-${i}`)),
          canAdd: true,
        });

      // force hasMore to false via empty page
      store.setSearch('test');
      store.loadPage().subscribe();
      httpMock
        .expectOne((r) => r.url.endsWith('/front/categories'))
        .flush({
          items: [],
          canAdd: true,
        });
      expect(store.hasMore()).toBeFalse();

      let emitted = false;
      store.loadPage().subscribe(() => (emitted = true));
      expect(emitted).toBeTrue();
    });

    it('should handle error response', () => {
      store.loadPage().subscribe();

      const req = httpMock.expectOne((r) => r.url.endsWith('/front/categories'));
      req.flush({ detail: 'Server error' }, { status: 500, statusText: 'Internal Server Error' });

      expect(store.error()).toBe('Server error');
      expect(store.loading()).toBeFalse();
    });
  });

  describe('setSearch', () => {
    it('should set search value and reset pagination', () => {
      // Pre-populate some items
      store['items'].set([mockItem(1, 'A')]);
      store['pageNumber'] = 3;
      store['hasMore'].set(false);

      store.setSearch('test');

      expect(store.search()).toBe('test');
      expect(store.items()).toEqual([]);
      expect(store['pageNumber']).toBe(0);
      expect(store.hasMore()).toBeTrue();
    });
  });

  describe('toggleSort', () => {
    it('should toggle sort direction and reset', () => {
      store['items'].set([mockItem(1, 'A')]);
      store['pageNumber'] = 2;

      store.toggleSort();

      expect(store.sortDesc()).toBeTrue();
      expect(store.items()).toEqual([]);
      expect(store['pageNumber']).toBe(0);

      store.toggleSort();
      expect(store.sortDesc()).toBeFalse();
    });
  });

  describe('save', () => {
    it('should call add and reload when no id provided', () => {
      store.save('NewCategory').subscribe();

      const req = httpMock.expectOne(
        (r) => r.method === 'POST' && r.url.endsWith('/front/categories'),
      );
      expect(req.request.body).toEqual({ name: 'NewCategory' });
      req.flush(1);

      const reloadReq = httpMock.expectOne(
        (r) => r.method === 'GET' && r.url.endsWith('/front/categories'),
      );
      reloadReq.flush({ items: [mockItem(1, 'NewCategory')], canAdd: true });
    });

    it('should call update when id provided', () => {
      store.save('Updated', 5).subscribe();

      const req = httpMock.expectOne(
        (r) => r.method === 'POST' && r.url.includes('/front/categories/5'),
      );
      expect(req.request.body).toEqual({ name: 'Updated' });
      req.flush({});

      const reloadReq = httpMock.expectOne(
        (r) => r.method === 'GET' && r.url.endsWith('/front/categories'),
      );
      reloadReq.flush({ items: [mockItem(5, 'Updated')], canAdd: true });
    });
  });

  describe('remove', () => {
    it('should remove item from list and call delete API', () => {
      store['items'].set([mockItem(1, 'A'), mockItem(2, 'B')]);

      store.remove(1).subscribe();

      expect(store.items().length).toBe(1);
      expect(store.items()[0].id).toBe(2);

      const req = httpMock.expectOne(
        (r) => r.method === 'DELETE' && r.url.includes('/front/categories/1'),
      );
      req.flush({});
    });

    it('should handle remove error', () => {
      store['items'].set([mockItem(1, 'A')]);

      store.remove(1).subscribe();

      const req = httpMock.expectOne(
        (r) => r.method === 'DELETE' && r.url.includes('/front/categories/1'),
      );
      req.flush({ detail: 'Delete failed' }, { status: 403, statusText: 'Forbidden' });

      expect(store.error()).toBe('Delete failed');
    });
  });

  describe('upsert', () => {
    it('should add new item to beginning', () => {
      store['items'].set([mockItem(1, 'A')]);

      store.upsert(mockItem(2, 'B'));

      expect(store.items().length).toBe(2);
      expect(store.items()[0].id).toBe(2);
    });

    it('should update existing item', () => {
      store['items'].set([mockItem(1, 'A'), mockItem(2, 'B')]);

      store.upsert({ id: 1, name: 'Updated A', canEdit: true, canDelete: true });

      expect(store.items().length).toBe(2);
      expect(store.items()[0].name).toBe('Updated A');
    });
  });

  describe('removeFromList', () => {
    it('should remove item by id', () => {
      store['items'].set([mockItem(1, 'A'), mockItem(2, 'B'), mockItem(3, 'C')]);

      store.removeFromList(2);

      expect(store.items().map((i) => i.id)).toEqual([1, 3]);
    });

    it('should do nothing if id not found', () => {
      store['items'].set([mockItem(1, 'A')]);

      store.removeFromList(999);

      expect(store.items().length).toBe(1);
    });
  });
});
