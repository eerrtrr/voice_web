import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebResearchComponent } from './web-research.component';

describe('WebResearchComponent', () => {
  let component: WebResearchComponent;
  let fixture: ComponentFixture<WebResearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebResearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebResearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
