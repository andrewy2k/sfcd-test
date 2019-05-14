import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Settings} from '../const/settings';
import {Observable} from 'rxjs';
import {IErrorResponce, IResponceQuestion} from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseURL = this.settings.baseUrl;
  URL = {
    QUESTIONS: 'questions'
  };

  private headers = new HttpHeaders({
    'Content-Type': 'jsonp',
    'Access-Control-Allow-Methods': 'POST, GET'
  });

  options = {headers: this.headers, params: {}};

  constructor(private settings: Settings, private http: HttpClient) {
  }

  // Получить список вопросов
  getQuestions(pagesize: number, page: number): Observable<any> {
    const params = new HttpParams()
      .set('pagesize', String(pagesize))
      .set('page', String(page))
      .set('order', 'desc')
      .set('site', 'stackoverflow')
      .set('sort', 'activity').toString();
    return this.http.jsonp<any>(this.baseURL + this.URL.QUESTIONS + '?' + params, 'callback');
  }

  // Получить список вопросов
  getQuestionById(id: number): Observable<any> {
    const params = new HttpParams()
      .set('filter', 'withbody')
      .set('site', 'stackoverflow').toString();
    return this.http.jsonp<any>(this.baseURL + this.URL.QUESTIONS + '/' + String(id) + '?' + params, 'callback');
  }

}
