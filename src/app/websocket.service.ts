import { Injectable, ɵConsole } from '@angular/core';
import { map, tap, catchError } from 'rxjs/operators';
import { BehaviorSubject, Subscription, EMPTY } from 'rxjs';
// import { BluetoothCore, BrowserWebBluetooth, ConsoleLoggerService } from '@manekinekko/angular-web-bluetooth';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

// service and characteristics numbers
import { BLE_SERVICE, COMMAND_CHARACT, DIAG_CHARACT, PARAM_CHARACT, PYRO_CHARACT, GUIDING_CHARACT, FLIGHT_DATA_CHARACT } from './consts';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  isConnected = false;
  connected_address = "";
  private socket$: WebSocketSubject<any>;

  // private _config: ServiceOptions;
  private paramSource = new BehaviorSubject('0|0|0|0|0');
  private diagSource = new BehaviorSubject('0|0|0|0|0|0|0|0|0|0|0');
  private pyroSource = new BehaviorSubject('0|0|0|0|0|0|0|0|0|0|0');
  private guidingSource = new BehaviorSubject('0|0|0|0|0|0|0|0|0|0|0');
  private flightDataSource = new BehaviorSubject('0|0|0|0|0|0|0|0|0|0|0');

  paramValue = this.paramSource.asObservable();
  diagValue = this.diagSource.asObservable();
  pyroValue = this.pyroSource.asObservable();
  guidingValue = this.guidingSource.asObservable();
  flightDataValue = this.flightDataSource.asObservable();

  private primaryService;

  private commandCharacteristic;
  private paramCharacteristic;
  private diagCharacteristic;
  private guidingCharacteristic;
  private pyroCharacteristic;
  private flightDataCharacteristic;

  constructor() { }

  decoder(value) {
    // const enc = new TextDecoder('utf-8');
    // console.log(value);
    // const decoded = enc.decode(value);
    return value;
  }

  async connect(address) {
    // let device = await this.ble.discover({
    //   filters: [
    //     { services: [BLE_SERVICE] }
    //   ]
    // });

    console.log("Inside WebsocketService::connect");

    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = this.getNewWebSocket(address);

      this.socket$.asObservable().subscribe(
        msg => {
          // console.log('message received: ');
          // console.log(msg);
          this.isConnected = true;
          this.connected_address = msg.origin;
        }, // Called whenever there is a message from the server.
        err => {
          console.log(err), // Called if at any point WebSocket API signals some kind of error.
          this.isConnected = false;
          this.connected_address = null;
        },
        () => {
          console.log('complete') // Called when connection is closed (for whatever reason).
          this.isConnected = false;
          this.connected_address = null;
        }
      )
      // const messages = this.socket$.pipe(
      //   tap({
      //     error: error => console.log(error),
      //   }), catchError(_ => EMPTY));
      // const messages = this.socket$.pipe( map(this.decoder), catchError(_ => EMPTY));
      // this.messagesSubject$.next(messages);


      this.socket$.pipe(map(this.decoder)).subscribe(value => {

        // console.log(value.data.slice(0,2));
        switch(value.data.slice(0,2)) {
          case 'T1':
              this.diagSource.next(value);
              break;
            case 'T2':
              // console.log(value);
              this.paramSource.next(value);
              break;
            case 'T3':
              this.pyroSource.next(value);
              break;
            case 'T4':
              this.guidingSource.next(value);
              break;
            default:
            console.log(`Data of unrecognized type`);
        }
      });
    }

    // console.log(device);
    // await this.ble.connectDevice(device)
    // console.log(this.ble._gattServer);
    
    // this.primaryService = await this.ble.getPrimaryService(this.ble._gattServer, BLE_SERVICE);
    // console.log(this.primaryService);

    // this.paramCharacteristic = await this.ble.getCharacteristic(this.primaryService, PARAM_CHARACT);
    // // console.log(this.paramCharacteristic);
    

    // this.ble.observeValue$(this.paramCharacteristic).pipe(map(this.decoder)).subscribe(value => {
    //   this.paramSource.next(value);
    // });


    // this.diagCharacteristic = await this.ble.getCharacteristic(this.primaryService, DIAG_CHARACT);

    // this.ble.observeValue$(this.diagCharacteristic).pipe(map(this.decoder)).subscribe(value => {
    //   this.diagSource.next(value);
    // });

    // this.pyroCharacteristic = await this.ble.getCharacteristic(this.primaryService, PYRO_CHARACT);

    // this.ble.observeValue$(this.pyroCharacteristic).pipe(map(this.decoder)).subscribe(value => {
    //   this.pyroSource.next(value);
    // });

    // this.guidingCharacteristic = await this.ble.getCharacteristic(this.primaryService, GUIDING_CHARACT);  // Change to GUIDING_CHARACT

    // this.ble.observeValue$(this.guidingCharacteristic).pipe(map(this.decoder)).subscribe(value => {
    //   // console.log(value);
    //   this.guidingSource.next(value);
    // });

    // this.flightDataCharacteristic = await this.ble.getCharacteristic(this.primaryService, FLIGHT_DATA_CHARACT);  // Change to FLIGHT_DATA

    // this.ble.observeValue$(this.flightDataCharacteristic).pipe(map(this.decoder)).subscribe(value => {
    //   console.log(value);
    //   this.flightDataSource.next(value);
    // });

  }

  getDevice() {

    // if (!this.socket$ || this.socket$.closed) {
    //   console.log("inside get device: false");
    //   return null;
    // }
    // console.log("inside get device: true");
    // return this.socket$;

    return this.isConnected;

  }

  setValue(characteristic: BluetoothCharacteristicUUID, value: any) {
    return this.sendMessage(value);
    // return this.ble.setCharacteristicState(BLE_SERVICE, characteristic, this.str2ab(value));
  }

  disconnectDevice() {
    this.close();
  }

  private getNewWebSocket(address) {
    // return webSocket("ws://192.168.70.159:1337");

    console.log(`Attempting to connect to:  ${address}`);
    return webSocket({
      url: address,
      deserializer: msg => msg
  });
  }
  sendMessage(msg: any) {
    console.log(`About to send message: ${msg}`);
    return this.socket$.next(msg);
  }
  close() {
    this.socket$.complete(); 
    this.socket$.closed = true;
  }

  str2ab(str) {
    let buf = new ArrayBuffer(str.length); // 2 bytes for each char
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }
}
