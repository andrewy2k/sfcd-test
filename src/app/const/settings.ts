/* Глобальный константы для конфигурации сервисов */
import {Injectable} from '@angular/core';

@Injectable()
export class Settings {
  public title = 'TestAPP';
  public baseUrl = 'https://api.stackexchange.com/2.2/';
}
