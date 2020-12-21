import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageLeftComponent } from './page-left.component';

describe('PageLeftComponent', () => {
  let component: PageLeftComponent;
  let fixture: ComponentFixture<PageLeftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageLeftComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
