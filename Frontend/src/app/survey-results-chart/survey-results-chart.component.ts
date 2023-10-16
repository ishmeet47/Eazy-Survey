import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ClickOutsideDirective } from '../directives/ClickOutsideDirective';
import { QuestionOptions } from '../interfaces/QuestionOptions';

@Component({
  selector: 'app-survey-results-chart',
  templateUrl: './survey-results-chart.component.html',
  styleUrls: ['./survey-results-chart.component.css'],
})
export class SurveyResultsChartComponent implements OnInit {
  @Input() surveyResults: {
    [key: string]: { id: number; label: string; count?: number }[];
  } = {};

  @Input() totalNumberOfUsers: number = 0;

  chartOptions: any;

  constructor(private cdr: ChangeDetectorRef) {}

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
        type: 'bar',
      },
      xaxis: {
        categories: categories,
      },
      series: [
        {
          name: 'Responses',
          data: seriesData,
        },
      ],
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
        // position: 'topRight',
        enabled: true,
        shared: true,
        intersect: false, // <-- Add this line
        custom: function ({
          series,
          seriesIndex,
          dataPointIndex,
          w,
        }: {
          series: number[][];
          seriesIndex: number;
          dataPointIndex: number;
          w: any;
        }) {
          const label = combinedLabels[dataPointIndex];
          return `<div class="text-black">${label}: ${series[seriesIndex][dataPointIndex]}</div>`;
        },

        // custom: function ({ }) {
        //   return '<div>Test Tooltip</div>';
        // }
      },
    };

    this.cdr.detectChanges();
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

  getOptionsForQuestion(question: string): { label: string; count?: number }[] {
    return this.surveyResults[question];
  }
}
