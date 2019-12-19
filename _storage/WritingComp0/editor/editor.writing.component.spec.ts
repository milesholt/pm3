import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkupWritingComponent } from './markup.writing.component';

describe('MarkupWritingComponent', () => {
  let component: MarkupWritingComponent;
  let fixture: ComponentFixture<MarkupWritingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkupWritingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkupWritingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
