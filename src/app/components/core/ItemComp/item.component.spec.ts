import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemComponent2 } from './item.component';

describe('ItemComponent', () => {
  let component: ItemComponent2;
  let fixture: ComponentFixture<ItemComponent2>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemComponent2 ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemComponent2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
