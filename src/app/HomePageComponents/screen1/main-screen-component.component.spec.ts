import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainScreenComponentComponent } from './main-screen-component.component';

describe('MainScreenComponentComponent', () => {
  let component: MainScreenComponentComponent;
  let fixture: ComponentFixture<MainScreenComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainScreenComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainScreenComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
