import {Component, OnInit, ElementRef} from '@angular/core';
import {IQuestion, IQuestionOwner} from '../../models/models';
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
  errorStatus: boolean;

  questionViewStatus: boolean;


  constructor(private api: ApiService) {
  }

  ngOnInit() {
    this.hasMore = true;
    this.loadData();
  }

  makeErrorMessage(message: string): void {
    this.selectedQuestion = {
      tags: [],
      owner: null,
      is_answered: false,
      accepted_answer_id: 0,
      view_count: 0,
      answer_count: 0,
      score: 0,
      last_edit_date: 0,
      last_activity_date: 0,
      creation_date: 0,
      question_id: 0,
      link: '',
      title: 'Ошибка выполнения запроса',
      body: message,
    };
    this.errorStatus = true;
    this.questionViewStatus = true;
  }

  openQuestion(item: IQuestion): void {
    if (this.quotaRemaining > 0) {
      this.questionLoadStatus = true;
      this.questionViewStatus = true;
      throw this.api.getQuestionById(item.question_id).subscribe(
        data => {
          if (!data.error_id) {
            this.selectedQuestion = data.items[0];
            this.quotaRemaining = data.quota_remaining;
          } else {
            this.makeErrorMessage('Исчерпан лимит запросов на сервер!!!');
          }
          this.questionLoadStatus = false;
        },
        error1 => {
          console.log(error1);
          this.makeErrorMessage('Ошибка выполнения запроса на сервере!!!');
          this.questionLoadStatus = false;
        }
      );
    } else {
      this.makeErrorMessage('Исчерпан лимит запросов на сервер!!!');
    }
  }

  closeQuestion(): void {
    setTimeout(() => {
      this.questionViewStatus = false;
      this.selectedQuestion = null;
      this.errorStatus = false;
    }, 300);
  }

  loadData(): void {
    if (this.hasMore && (this.quotaRemaining === -1 || this.quotaRemaining > 0)) {
      this.questionsLoadStatus = true;
      this.api.getQuestions(this.pageSize, this.currentPage).subscribe(
        data => {
          if (!data.error_id) {
          data.items.map((elem) => {
            elem.creation_date = new Date(elem.creation_date * 1000);
          });
          this.questions.push(...data.items);
          this.questions = [...this.questions];
          this.quotaRemaining = data.quota_remaining;
          this.hasMore = data.has_more;
          this.currentPage++;
          } else {
            this.makeErrorMessage('Исчерпан лимит запросов на сервер!!!');
          }
          this.questionsLoadStatus = false;
        },
        error1 => {
          console.log(error1);
          this.makeErrorMessage('Ошибка выполнения запроса на сервере!!!');
          this.questionsLoadStatus = false;
        }
      );
    } else {
      this.makeErrorMessage('Исчерпан лимит запросов на сервер или закончились данные!!!');
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
