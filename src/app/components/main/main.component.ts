import {Component, OnInit, ElementRef} from '@angular/core';
import {IQuestion} from '../../models/models';
import {ApiService} from '../../services/api.service';
import {animate, animation, useAnimation, style, transition, trigger} from '@angular/animations';

export const slideInAnimation = animation([
  style({transform: 'translateY({{ from }})', opacity: 0}),
  animate('{{ timings }}', style('*'))
]);

export const slideOutAnimation = animation([
  animate(
    '{{ timings }}',
    style({transform: 'translateY({{ to }})', opacity: 0})
  )
]);

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less'],
  animations: [
    trigger('viewQuestionDescription', [
      transition(':enter', [
        useAnimation(slideInAnimation, {
          params: {from: '25%', timings: '200ms ease-in'}
        })
      ]),
      transition(':leave', [
        useAnimation(slideOutAnimation, {
          params: {to: '-200%', timings: '200ms ease-in'}
        })
      ])
    ])
  ]
})


export class MainComponent implements OnInit {

  questions: IQuestion[] = [];
  selectedQuestion: IQuestion;
  questionsLoadStatus: boolean;
  questionLoadStatus: boolean;
  quotaRemaining = -1;
  currentPage = 1;
  pageSize = 65;
  hasMore: boolean;

  questionViewStatus: boolean;


  constructor(private api: ApiService) {
  }

  ngOnInit() {
    this.hasMore = true;
    this.loadData();
  }

  openQuestion(item: IQuestion): void {
    if (this.quotaRemaining > 0) {
      this.questionLoadStatus = true;
      this.questionViewStatus = true;
      this.api.getQuestionById(item.question_id).subscribe(
        data => {
          this.selectedQuestion = data.items[0];
          this.quotaRemaining = data.quota_remaining;
          this.questionLoadStatus = false;
        },
        error1 => {
          console.log(error1);
          this.questionLoadStatus = false;
        }
      );
    }
  }

  closeQuestion(): void {
    setTimeout(() => {
      this.questionViewStatus = false;
      this.selectedQuestion = null;
    }, 300);
  }

  loadData(): void {
    if (this.hasMore && (this.quotaRemaining === -1 || this.quotaRemaining > 0)) {
      this.questionsLoadStatus = true;
      this.api.getQuestions(this.pageSize, this.currentPage).subscribe(
        data => {
          data.items.map((elem) => {
            elem.creation_date = new Date(elem.creation_date * 1000);
          });
          this.questions.push(...data.items);
          this.questions = [...this.questions];
          this.quotaRemaining = data.quota_remaining;
          this.hasMore = data.has_more;
          this.currentPage++;
          this.questionsLoadStatus = false;
        },
        error1 => {
          console.log(error1);
          this.questionsLoadStatus = false;
        }
      );
    }
  }

  checkQuestion(event: any): void {
    for (let i = 0; i < event.target.childNodes[0].children.length - 1; i++) {
      if (event.target.childNodes[0].children[i].attributes['data-load-status'].value === 'true') {
        event.target.childNodes[0].children[i].attributes['data-load-status'].value = 'false';
        this.loadData();
      }
    }
  }
}
