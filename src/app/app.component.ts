import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
// import { BleService } from './ble.service';
import { WebsocketService } from './websocket.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {
  title = 'morgan-app';
  address = 'ws://192.168.4.1:1337';


  get device() {
    // return this.service.getDevice();
    return this.service.getDevice();
  }

  constructor(public service: WebsocketService) {
  }


  ngOnInit() {
    this.address = localStorage.getItem('Morgan_WebSocket');
    // this.service.connect();
  }

  connect() {
    this.service.connect(this.address);
    localStorage.setItem('Morgan_WebSocket', this.address);
  }


  disconnect() {
    this.service.disconnectDevice();
  }

  hasError(error: string) {
  }


  ngOnDestroy() {

  }

}

