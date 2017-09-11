import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Screen2PanelComponent } from './screen2-panel.component';

describe('Screen2PanelComponent', () => {
  let component: Screen2PanelComponent;
  let fixture: ComponentFixture<Screen2PanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Screen2PanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Screen2PanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
