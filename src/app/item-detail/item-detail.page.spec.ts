import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ItemDetailPage } from './item-detail.page';

describe('ItemDetailPage', () => {
  let component: ItemDetailPage;
  let fixture: ComponentFixture<ItemDetailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemDetailPage],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
