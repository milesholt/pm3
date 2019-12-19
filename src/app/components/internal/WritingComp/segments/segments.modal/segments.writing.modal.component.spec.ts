import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SegmentsWritingModalComponent } from './segments.writing.modal.component';

describe('SegmentsWritingModalComponent', () => {
  let component: SegmentsWritingModalComponent;
  let fixture: ComponentFixture<SegmentsWritingModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SegmentsWritingModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SegmentsWritingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
