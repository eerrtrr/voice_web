import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitMenuComponent } from './init-menu.component';

describe('InitMenuComponent', () => {
  let component: InitMenuComponent;
  let fixture: ComponentFixture<InitMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InitMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
