import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageCenterComponent } from './page-center.component';

describe('PageCenterComponent', () => {
  let component: PageCenterComponent;
  let fixture: ComponentFixture<PageCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageCenterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
