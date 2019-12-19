import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupsWritingModalComponent } from './groups.writing.modal.component';

describe('GroupsWritingModalComponent', () => {
  let component: GroupsWritingModalComponent;
  let fixture: ComponentFixture<GroupsWritingModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupsWritingModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupsWritingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
