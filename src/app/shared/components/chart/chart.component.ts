import { Component, Input, OnInit, ViewChild } from '@angular/core';
import * as ApexCharts from 'apexcharts';
import { 
  ApexAxisChartSeries, 
  ApexChart, 
  ApexDataLabels,        
  ApexGrid, 
  ApexLegend, 
  ApexResponsive, 
  ApexStroke,      
  ApexTitleSubtitle, 
  ApexXAxis, 
  ApexYAxis, 
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  colors: string[];
  yaxis: ApexYAxis;
  grid: ApexGrid;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
  responsive: ApexResponsive[];
};

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit{
  @ViewChild('chart')
  chart!: ApexCharts;
  chartOptions!: ChartOptions;
  private shouldRedrawChart = false;

  //Input series
  @Input() avgTemp!: (number | null)[];
  @Input() avgHumidity!: (number | null)[];
  @Input() avgSoilMoisture!: (number | null)[];
  @Input() avgDust!: (number | null)[];
  @Input() avgRain!: (number | null)[];
  @Input() avgCO!: (number | null)[];

  //Set rerender flag to true
  ngOnChanges() {
    this.shouldRedrawChart = true;
  }

  //Initialize chart
  ngOnInit(): void {
    this.renderChart();
  }

  //Check the flag and rerender if data changed
  ngAfterViewChecked() {
    if (this.shouldRedrawChart && this.chart) {
      this.renderChart();
      this.shouldRedrawChart = false;
    }
  }

  renderChart() {
    this.chartOptions = {
      series: [
        {
          name: "Temperature",
          data: this.avgTemp
        },
        {
          name: "Humidity",
          data: this.avgHumidity
        },
        {
          name: "Soil Moisture",
          data: this.avgSoilMoisture
        },
        {
          name: "Rain",
          data: this.avgRain
        },
        {
          name: "CO",
          data: this.avgCO
        },
        {
          name: "Dust",
          data: this.avgDust
        }
      ],
      chart: {
        width: 800,
        height: 360,
        type: "line",
        dropShadow: {
          enabled: true,
          color: "#000",
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2
        },
        toolbar: {
          show: true
        }
      },
      colors: ["#2d9399", "#37ae83", "#9d4337", "#a68b41", "#0d6cdd", "#574103"],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight",
        width: 2
      },
      title: {
        text: "Average Readings Summary",
        align: "left"
      },
      grid: {
        borderColor: "#e7e7e7",
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 1
        }
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        title: {
          text: "Month"
        }
      },
      yaxis: {
        title: {
          text: "Readings",
        },
        min: 0,
        max: 200
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -15,
        offsetX: -5
      },
      responsive: [
        {
          breakpoint: 1800,
          options: {
            chart: {
              width: 600,
            }
          }
        },
        {
          breakpoint: 768,
          options: {
            chart: {
              width: 440,
            },
            legend: {
              horizontalAlign: "left",
            }
          }
        },
        {
          breakpoint: 400,
          options: {
            chart: {
              width: 350,
            },
            legend: {
              horizontalAlign: "left",
            }
          }
        }
      ]
    };
  }
}
