import {
  Renderer2,
  ElementRef,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { ClickOutsideDirective } from '../directives/ClickOutsideDirective';
import { QuestionOptions } from '../interfaces/QuestionOptions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-survey-results-chart',
  templateUrl: './survey-results-chart.component.html',
  styleUrls: ['./survey-results-chart.component.css'],
})
export class SurveyResultsChartComponent implements OnInit, OnChanges {
  @Input() surveyResults: {
    [key: string]: { id: number; label: string; count?: number }[];
  } = {};

  @Input() totalNumberOfUsers: number = 0;

  chartOptions: any;

  isChartVisible: boolean = true; // New property to manage chart visibility

  currentQuestionIndex: number = 0;
  currentQuestionData: { id: number; label: string; count?: number }[] = [];

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  @Input() closeResultsChartModal: () => void = () => { };

  ngOnInit(): void {
    this.generateChartForCurrentQuestion();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Check if 'surveyResults' input has changed
    if (changes['surveyResults']) {
      // Perform the operation based on the change
      if (this.surveyResults && Object.keys(this.surveyResults).length > 0) {
        // Now that we're sure there's data, we can generate the chart
        this.generateChartForCurrentQuestion();
      }
    }
  }

  hideChart(): void {
    console.log('Hiding chart...');

    // Access the native element and alter its style
    const container = this.el.nativeElement.querySelector('.outer-container');
    this.renderer.setStyle(container, 'display', 'none');

    // Continue with existing logic
    this.isChartVisible = false;
    this.chartOptions = null;
    this.cdr.detectChanges();
    console.log('isChartVisible state:', this.isChartVisible);

    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/admin/dashboard']);
    });
  }

  // goToNextQuestion(): void {
  //   this.currentQuestionIndex++;
  //   if (this.currentQuestionIndex >= this.getQuestions().length) {
  //     this.currentQuestionIndex = this.getQuestions().length - 1; // Prevent going beyond last question
  //   }
  //   this.updateChartData();
  // }

  // goToPreviousQuestion(): void {
  //   this.currentQuestionIndex--;
  //   if (this.currentQuestionIndex < 0) {
  //     this.currentQuestionIndex = 0; // Prevent negative index
  //   }
  //   this.updateChartData();
  // }

  navigate(direction: 'next' | 'prev'): void {
    console.log('Navigate function triggered'); // Check if this appears when you click the "Close" button, which would be incorrect behavior.

    if (
      direction === 'next' &&
      this.currentQuestionIndex < this.getQuestions().length - 1
    ) {
      this.currentQuestionIndex++;
    } else if (direction === 'prev' && this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }

    this.generateChartForCurrentQuestion();
    // this.cdr.detectChanges();
  }

  generateChartForCurrentQuestion(): void {
    const questions = this.getQuestions();

    // Check if questions exist and currentQuestionIndex is valid
    if (
      !questions ||
      this.currentQuestionIndex < 0 ||
      this.currentQuestionIndex >= questions.length
    ) {
      return;
    }

    const question = questions[this.currentQuestionIndex];

    // Check if options exist for the question
    const options = this.surveyResults[question];
    if (!options) {
      return;
    }

    const categories = options.map((option) => option.label);
    const seriesData = options.map((option) => option.count || 0);

    this.chartOptions = {
      ...this.chartOptions,
      chart: {
        type: 'bar',
      },
      xaxis: {
        categories: categories,
        title: {
          text: question, // Displaying the question as title of x-axis
          style: {
            fontSize: '14px', // You can adjust the font size and other styles here
            fontWeight: 'bold',
            color: '#263238', // adjust the color as per your preference
          },
        },
      },
      // yaxis: {
      //   show: false, // This line ensures that the y-axis is not visible.
      // },


      yaxis: {
        // Other y-axis properties...

        labels: {
          formatter: function (val: any) {
            // Return the value as a whole number
            return Math.round(val);
          },
          // Depending on the chart library, the 'formatter' may be inside 'style' or another sub-property.
        },

        // Optionally, to avoid non-whole number intervals, you can control the steps between values.
        tickAmount: 'dataPoints', // or another specific number. This property's name and valid values depend on the charting library.

        // If your charting library supports it, you can enforce that only whole numbers are used for the axis ticks.
        forceNiceScale: true, // Property names like 'forceNiceScale' vary by library; consult your library's documentation.

        // Other y-axis settings...
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
          const label = series[dataPointIndex];
          const categories = w.globals.labels || []; // Adjust this based on how 'categories' are stored in your chart configuration.


          // Protect against undefined data
          if (!series[seriesIndex] || series[seriesIndex][dataPointIndex] === undefined) {
            console.error('Data point is missing in series.');
            return '';
          }

          // Check if the categories array has the specific index.
          if (typeof categories[dataPointIndex] === 'undefined') {
            console.error('Category label is missing.');
            return '';
          }
          // return `<div class="text-black">${label}: ${series[seriesIndex][dataPointIndex]}</div>`;

          return `<div class="text-black">${categories[dataPointIndex]} - ${series[seriesIndex][dataPointIndex]}</div>`;

        },

        // custom: function ({ }) {
        //   return '<div>Test Tooltip</div>';
        // }
      },
    };

    this.cdr.detectChanges();
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
