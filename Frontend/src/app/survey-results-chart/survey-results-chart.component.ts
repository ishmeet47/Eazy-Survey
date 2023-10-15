import { Component, Input, OnInit } from '@angular/core';
import { ClickOutsideDirective } from '../directives/ClickOutsideDirective';
import { QuestionOptions } from '../interfaces/QuestionOptions';

@Component({
  selector: 'app-survey-results-chart',
  templateUrl: './survey-results-chart.component.html',
  styleUrls: ['./survey-results-chart.component.css']
})




export class SurveyResultsChartComponent implements OnInit {

  @Input() surveyResults: { [key: string]: { id: number, label: string, count?: number }[] } = {};

  @Input() totalNumberOfUsers: number = 0;


  chartOptions: any;

  constructor() { }


  //   // this.chartOptions = this.getChartOptions();
  //   console.log('Chart Options:', this.chartOptions);
  //   console.log('Survey Results:', this.surveyResults);
  //   console.log('Total Number of Users:', this.totalNumberOfUsers);




  ngOnInit(): void {
    const categories: string[] = []; // This will hold only options now
    const seriesData: number[] = [];
    const combinedLabels: string[] = []; // Array to hold combined question and option for tooltip

    for (const [question, options] of Object.entries(this.surveyResults)) {
      for (const option of options) {
        combinedLabels.push(`${question}\n${option.label}`); // Store combined label for tooltip
        categories.push(option.label); // Store only option label for x-axis
        seriesData.push(option.count || 0);
      }
    }

    this.chartOptions = {
      chart: {
        type: 'bar'
      },
      xaxis: {
        categories: categories
      },
      series: [{
        name: 'Responses',
        data: seriesData
      }],
      // tooltip: {
      //   x: {
      //     show: true,
      //     formatter: function (val: any, opts: any) {
      //       const index = opts.dataPointIndex; // Get the index of the hovered bar.
      //       return combinedLabels[index]; // Return the combined question and option.
      //     }
      //   }
      // }


      tooltip: {
        position: 'topRight',
        enabled: true,
        shared: true,
        intersect: false, // <-- Add this line
        custom: function ({ series, seriesIndex, dataPointIndex, w }:
          { series: number[][], seriesIndex: number, dataPointIndex: number, w: any }) {
          const label = combinedLabels[dataPointIndex];
          return `<div>${label}: ${series[seriesIndex][dataPointIndex]}</div>`;
        }
      }







    };
  }








  hideChart(): void {
    this.chartOptions = null;
  }









  // final working
  // this is the most vague bar graph possible



  //  fully final updation
  // these are the helper methods for your use


  getQuestions(): string[] {
    return Object.keys(this.surveyResults);
  }

  getOptionsForQuestion(question: string): { label: string, count?: number }[] {
    return this.surveyResults[question];
  }








  // getChartOptions(): any {
  //   if (!this.surveyResults || this.totalNumberOfUsers <= 0) {
  //     return;
  //   }

  //   const categories: string[] = [];
  //   const seriesData: number[] = [];
  //   const seriesName: string[] = [];

  //   for (const question in this.surveyResults) {
  //     categories.push(question);  // Add the question to the categories

  //     for (const option of this.surveyResults[question]) {
  //       const percentage = option.count ? (option.count / this.totalNumberOfUsers) * 100 : 0;
  //       seriesData.push(percentage);
  //       seriesName.push(option.label);

  //       if (option !== this.surveyResults[question][this.surveyResults[question].length - 1]) {
  //         categories.push("");  // Use an empty string to create a gap for options
  //       }
  //     }
  //   }

  //   return {
  //     series: [{
  //       name: 'Options',
  //       data: seriesData,
  //       categories: seriesName
  //     }],
  //     xaxis: {
  //       categories: categories,
  //       labels: {
  //         formatter: function (value: any, index: any, series: any) {
  //           // Return the option label from the series categories
  //           if (value === "") return series.categories[index];
  //           return value;
  //         }
  //       }
  //     }
  //   };
  // }




}
