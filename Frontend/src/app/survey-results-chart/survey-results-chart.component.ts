import { Component, Input, OnInit } from '@angular/core';
import { ClickOutsideDirective } from '../directives/ClickOutsideDirective';

@Component({
  selector: 'app-survey-results-chart',
  templateUrl: './survey-results-chart.component.html',
  styleUrls: ['./survey-results-chart.component.css']
})
export class SurveyResultsChartComponent implements OnInit {

  @Input() surveyResults: any;
  @Input() totalNumberOfUsers?: number;
  chartOptions: any;

  constructor() { }

  ngOnInit(): void {
    this.prepareChartData();
  }

  hideChart(): void {
    this.chartOptions = null;
  }


  prepareChartData(): void {
    const categories = Object.keys(this.surveyResults);
    const seriesData = categories.map(category => {
      return this.surveyResults[category].map((option: any) => {
        return (option.count / (this.totalNumberOfUsers || 1)) * 100; // percentage
      });
    });

    this.chartOptions = {
      chart: {
        type: 'bar'
      },
      xaxis: {
        categories: categories
      },
      series: seriesData.map((data, idx) => ({
        name: categories[idx],
        data: data
      }))
    };
  }

}
