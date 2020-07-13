import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutInjuryComponent } from './about-injury.component';

describe('AboutInjuryComponent', () => {
  let component: AboutInjuryComponent;
  let fixture: ComponentFixture<AboutInjuryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutInjuryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutInjuryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
