import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllIconComponent } from './all-icon.component';

describe('AllIconComponent', () => {
  let component: AllIconComponent;
  let fixture: ComponentFixture<AllIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
