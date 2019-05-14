import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-wait',
  templateUrl: './wait.component.html',
  styleUrls: ['./wait.component.less']
})
export class WaitComponent implements OnInit {

  @Input() visible: boolean;
  @Input() blueColor: boolean;
  @Input() size: string;

  constructor() {
  }

  ngOnInit() {
  }

}
