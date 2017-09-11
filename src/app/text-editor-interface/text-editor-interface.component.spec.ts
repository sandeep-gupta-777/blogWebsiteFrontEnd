import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextEditorInterfaceComponent } from './text-editor-interface.component';

describe('TextEditorInterfaceComponent', () => {
  let component: TextEditorInterfaceComponent;
  let fixture: ComponentFixture<TextEditorInterfaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextEditorInterfaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextEditorInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
