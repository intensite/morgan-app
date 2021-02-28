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
  // address = 'ws://192.168.4.1:1337';
  address = '';
  detecting = false;


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

  detectFlightComputer() {
    this.detecting = true;
    this.address = "Detection en cours...";
    console.time("Detection");
    this.service.findServers(1337, "192.168.70.", 2, 254, 40, 6000, (servers) => {
      console.log(servers);
      this.detecting = false;
      this.address = servers[0];
      console.timeEnd("Detection");
    });

  }


  hasError(error: string) {
  }


  ngOnDestroy() {

  }

}

