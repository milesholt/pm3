import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsWritingComponent } from './items.writing.component';

describe('WritingComponent', () => {
  let component: ItemsWritingComponent;
  let fixture: ComponentFixture<ItemsWritingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemsWritingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsWritingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
