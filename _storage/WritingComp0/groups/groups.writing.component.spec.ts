import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupsWritingComponent } from './groups.writing.component';

describe('WritingComponent', () => {
  let component: GroupsWritingComponent;
  let fixture: ComponentFixture<GroupsWritingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupsWritingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupsWritingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
