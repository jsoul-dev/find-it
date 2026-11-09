import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../environments/environment';

import { ItemService } from './item';

describe('ItemService', () => {
  let service: ItemService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ItemService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should delete an item and update reactive state', () => {
    const dummyItem = {
      id: '99',
      name: 'Calculator',
      type: 'Lost' as const,
      description: 'Black Casio',
      contact: '09123456789',
      lat: 15.448,
      lng: 120.939,
      status: 'Open' as const,
      createdAt: '2026-11-09T00:00:00.000Z',
    };
    service.items.set([dummyItem]);

    service.deleteItem('99').subscribe((res) => {
      expect(res.id).toBe('99');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/99`);
    expect(req.request.method).toBe('DELETE');
    req.flush(dummyItem);

    expect(service.items().find((i) => i.id === '99')).toBeUndefined();
  });
});
