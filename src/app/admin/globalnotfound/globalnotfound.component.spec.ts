import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalnotfoundComponent } from './globalnotfound.component';

describe('GlobalnotfoundComponent', () => {
  let component: GlobalnotfoundComponent;
  let fixture: ComponentFixture<GlobalnotfoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalnotfoundComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalnotfoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
