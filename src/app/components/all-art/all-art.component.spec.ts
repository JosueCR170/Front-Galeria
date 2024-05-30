import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllArtComponent } from './all-art.component';

describe('AllArtComponent', () => {
  let component: AllArtComponent;
  let fixture: ComponentFixture<AllArtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllArtComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllArtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
