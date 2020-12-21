import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageRightComponent } from './page-right.component';

describe('PageRightComponent', () => {
  let component: PageRightComponent;
  let fixture: ComponentFixture<PageRightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageRightComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
