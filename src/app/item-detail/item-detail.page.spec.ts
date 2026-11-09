import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ItemDetailPage } from './item-detail.page';

describe('ItemDetailPage', () => {
  let component: ItemDetailPage;
  let fixture: ComponentFixture<ItemDetailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemDetailPage],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
