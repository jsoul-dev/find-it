import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import type { Item } from '../../models/item';
import { ItemCardComponent } from './item-card.component';

describe('ItemCardComponent', () => {
  let component: ItemCardComponent;
  let fixture: ComponentFixture<ItemCardComponent>;

  const mockItem: Item = {
    id: '1',
    name: 'Scientific Calculator',
    description: 'Black Casio fx-991EX',
    type: 'Lost',
    status: 'Open',
    contact: '0917-123-4567',
    lat: 15.44825,
    lng: 120.93922,
    createdAt: new Date().toISOString(),
  };

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('item', mockItem);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
