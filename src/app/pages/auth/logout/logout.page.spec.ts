import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthLogoutPage } from './logout.page';

describe('AuthRegisterPage', () => {
  let component: AuthLogoutPage;
  let fixture: ComponentFixture<AuthLogoutPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AuthLogoutPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [ReactiveFormsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthLogoutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
