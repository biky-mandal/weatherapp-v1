import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForcastChartComponent } from './forcast-chart.component';

describe('ForcastChartComponent', () => {
  let component: ForcastChartComponent;
  let fixture: ComponentFixture<ForcastChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ForcastChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForcastChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
