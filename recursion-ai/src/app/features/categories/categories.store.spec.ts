import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { CategoriesService } from '../../core/api';
import { Category } from '../../core/api-types';
import { PAGE_SIZE } from '../../core/config/constants';
import { CategoriesStore } from './categories.store';

function makeItems(count: number, startId = 1): Category[] {
  return Array.from({ length: count }, (_, i) => ({ id: startId + i, name: `c${startId + i}` }));
}

describe('CategoriesStore', () => {
  let store: CategoriesStore;
  let api: jasmine.SpyObj<CategoriesService>;

  beforeEach(() => {
    api = jasmine.createSpyObj<CategoriesService>('CategoriesService', ['getAll']);
    TestBed.configureTestingModule({
      providers: [CategoriesStore, { provide: CategoriesService, useValue: api }],
    });
    store = TestBed.inject(CategoriesStore);
  });

  it('loads first page and sets canEdit', () => {
    api.getAll.and.returnValue(of({ items: makeItems(PAGE_SIZE), canEdit: true }) as any);

    store.reload();

    expect(store.items().length).toBe(PAGE_SIZE);
    expect(store.canEdit()).toBeTrue();
    expect(store.hasMore()).toBeTrue();
  });

  it('stops pagination when returned items fewer than PAGE_SIZE', () => {
    api.getAll.and.returnValue(of({ items: makeItems(PAGE_SIZE - 1), canEdit: false }) as any);

    store.reload();

    expect(store.hasMore()).toBeFalse();
    store.loadNextPage();
    // второй вызов не должен ничего грузить (hasMore=false)
    expect(api.getAll).toHaveBeenCalledTimes(1);
  });

  it('appends next page items immutably', () => {
    api.getAll.and.returnValues(
      of({ items: makeItems(PAGE_SIZE, 1), canEdit: true }) as any,
      of({ items: makeItems(2, PAGE_SIZE + 1), canEdit: true }) as any,
    );

    store.reload();
    const firstRef = store.items();
    store.loadNextPage();

    expect(store.items().length).toBe(PAGE_SIZE + 2);
    expect(store.items()).not.toBe(firstRef);
  });

  it('resets pagination on new search', () => {
    api.getAll.and.returnValue(of({ items: makeItems(2), canEdit: true }) as any);
    store.reload();

    store.setSearch('foo');

    expect(api.getAll).toHaveBeenCalledTimes(2);
    const lastArgs = api.getAll.calls.mostRecent().args[0];
    expect(lastArgs?.search).toBe('foo');
    expect(lastArgs?.pageNumber).toBe(0);
  });

  it('does not reload when search value is unchanged', () => {
    api.getAll.and.returnValue(of({ items: [], canEdit: true }) as any);
    store.setSearch('');
    expect(api.getAll).not.toHaveBeenCalled();
  });

  it('toggles sort and reloads with sortDesc', () => {
    api.getAll.and.returnValue(of({ items: makeItems(1), canEdit: true }) as any);
    store.reload();

    store.toggleSort();

    expect(store.sortDesc()).toBeTrue();
    expect(api.getAll.calls.mostRecent().args[0]?.sortDesc).toBeTrue();
  });

  it('removeFromList removes the item immutably', () => {
    api.getAll.and.returnValue(of({ items: makeItems(3), canEdit: true }) as any);
    store.reload();
    const before = store.items();

    store.removeFromList(2);

    expect(store.items().map((i) => i.id)).toEqual([1, 3]);
    expect(store.items()).not.toBe(before);
  });

  it('upsert adds a new item and updates an existing one', () => {
    api.getAll.and.returnValue(of({ items: makeItems(2), canEdit: true }) as any);
    store.reload();

    store.upsert({ id: 99, name: 'new' });
    expect(store.items().some((i) => i.id === 99)).toBeTrue();

    store.upsert({ id: 1, name: 'renamed' });
    expect(store.items().find((i) => i.id === 1)?.name).toBe('renamed');
  });

  it('sets error on failed load', () => {
    api.getAll.and.returnValue(throwError(() => new Error('boom')));
    store.reload();
    expect(store.error()).toBeTruthy();
    expect(store.loading()).toBeFalse();
  });
});
