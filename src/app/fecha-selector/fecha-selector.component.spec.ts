import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FechaSelectorComponent } from './fecha-selector.component';

describe('FechaSelectorComponent', () => {
  let component: FechaSelectorComponent;
  let fixture: ComponentFixture<FechaSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FechaSelectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FechaSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
