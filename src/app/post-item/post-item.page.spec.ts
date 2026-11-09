import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { PostItemPage } from './post-item.page';

describe('PostItemPage', () => {
  let component: PostItemPage;
  let fixture: ComponentFixture<PostItemPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PostItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
