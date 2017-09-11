import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogDisplayComponent } from './blog-display.component';

describe('BlogDisplayComponent', () => {
  let component: BlogDisplayComponent;
  let fixture: ComponentFixture<BlogDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlogDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
