import { Component, OnDestroy, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { ApisService } from '../../services/apis.service';

@Component({
  selector: 'app-forcast-chart',
  templateUrl: './forcast-chart.component.html',
  styleUrl: './forcast-chart.component.scss',
})
export class ForcastChartComponent implements OnInit, OnDestroy {
  chart: any = Chart;
  data: any = [];
  daylyData: any = {
    labels: [],
    values: [],
  };
  hourlyData: any = {
    labels: [],
    values: [],
  };

  chartConfig: any = {
    type: 'line',
    data: {
      labels: this.daylyData.labels,
      datasets: [
        {
          label: 'Dataset',
          data: this.daylyData.values,
          borderColor: '#fff',
          backgroundColor: '#fff',
          pointStyle: 'circle',
          pointRadius: 5,
          pointHoverRadius: 10,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        title: {
          display: false,
        },
        legend: {
          display: false,
        },
        tooltip: {
          // Tooltip config options
          enabled: true,
          backgroundColor: '#9cbba1',
          titleColor: '#042a0b',
          bodyColor: '#042a0b',
          titleFont: { weight: 'bold' },
          padding: 10,
          cornerRadius: 10,
          borderColor: '#042a0b',
          borderWidth: '2',
          xAlign: 'left',
          callbacks: {
            label: function (tooltipData: any) {
              const values = tooltipData.dataset.data[tooltipData.dataIndex];

              return `  ${values}°C`;
            },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: '#fff',
          },
          grid: {
            display: false,
          },
        },
        y: {
          display: false,
          ticks: {
            display: false,
          },
          grid: {
            display: false,
          },
        },
      },
      elements: {
        line: {
          tension: 0.4, // smooth lines
        },
      },
    },
  };

  constructor(private apiServ: ApisService) {}

  ngOnInit(): void {
    this.apiServ.weatherData.subscribe((data: any) => {
      data?.forecast?.forecastday.map((d: any) => {
        this.daylyData.labels.push(d?.date);
        this.daylyData.values.push(d?.day?.avgtemp_c);

        d.hour.map((h: any) => {
          this.hourlyData.labels.push(h?.time.split(' ')[1]);
          this.hourlyData.values.push(h?.temp_c);
        });
      });
      // Before ploting graph we need to destroy the canvas
      Chart.getChart('canvas')?.destroy();
      this.chart = new Chart('canvas', this.chartConfig);
    });
  }

  ngOnDestroy(): void {
    Chart.getChart('canvas')?.destroy();
  }
}
