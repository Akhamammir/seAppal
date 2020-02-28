import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemainingPage } from './remaining.page';

describe('RemainingPage', () => {
  let component: RemainingPage;
  let fixture: ComponentFixture<RemainingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemainingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemainingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
