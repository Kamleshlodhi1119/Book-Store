import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllapisComponent } from './allapis.component';

describe('AllapisComponent', () => {
  let component: AllapisComponent;
  let fixture: ComponentFixture<AllapisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllapisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllapisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
