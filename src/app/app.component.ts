import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { BleService } from './ble.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {
  title = 'morgan-app';


  get device() {
    return this.service.getDevice();
  }

  constructor(public service: BleService) {
  }


  ngOnInit() {

  }

  requestValue() {
    this.service.connect();
  }


  disconnect() {
    this.service.disconnectDevice();
  }

  hasError(error: string) {
  }


  ngOnDestroy() {

  }

}

