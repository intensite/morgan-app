import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Subscription } from 'rxjs';
import { BluetoothCore, BrowserWebBluetooth, ConsoleLoggerService } from '@manekinekko/angular-web-bluetooth';

// service and characteristics numbers
import { BLE_SERVICE, COMMAND_CHARACT, DIAG_CHARACT, PARAM_CHARACT, PYRO_CHARACT, GUIDING_CHARACT } from './consts';

@Injectable({
  providedIn: 'root'
})
export class BleService {

  // private _config: ServiceOptions;
  private paramSource = new BehaviorSubject('0|0|0|0|0');
  private diagSource = new BehaviorSubject('0|0|0|0|0|0|0|0|0|0|0');
  private pyroSource = new BehaviorSubject('0|0|0|0|0|0|0|0|0|0|0');
  private guidingSource = new BehaviorSubject('0|0|0|0|0|0|0|0|0|0|0');

  paramValue = this.paramSource.asObservable();
  diagValue = this.diagSource.asObservable();
  pyroValue = this.pyroSource.asObservable();
  guidingValue = this.guidingSource.asObservable();

  private primaryService;

  private commandCharacteristic;
  private paramCharacteristic;
  private diagCharacteristic;
  private guidingCharacteristic;
  private pyroCharacteristic;

  constructor(public ble: BluetoothCore) { }

  decoder(value) {
    const enc = new TextDecoder('utf-8');
    const decoded = enc.decode(value);
    return decoded;
  }

  async connect() {
    let device = await this.ble.discover({
      filters: [
        { services: [BLE_SERVICE] }
      ]
    });

    console.log(device);
    await this.ble.connectDevice(device)
    console.log(this.ble._gattServer);

    this.primaryService = await this.ble.getPrimaryService(this.ble._gattServer, BLE_SERVICE);
    console.log(this.primaryService);


    this.paramCharacteristic = await this.ble.getCharacteristic(this.primaryService, PARAM_CHARACT);
    // console.log(this.paramCharacteristic);

    this.ble.observeValue$(this.paramCharacteristic).pipe(map(this.decoder)).subscribe(value => {
      this.paramSource.next(value);
    });


    this.diagCharacteristic = await this.ble.getCharacteristic(this.primaryService, DIAG_CHARACT);

    this.ble.observeValue$(this.diagCharacteristic).pipe(map(this.decoder)).subscribe(value => {
      this.diagSource.next(value);
    });

    this.pyroCharacteristic = await this.ble.getCharacteristic(this.primaryService, PYRO_CHARACT);

    this.ble.observeValue$(this.pyroCharacteristic).pipe(map(this.decoder)).subscribe(value => {
      this.pyroSource.next(value);
    });

    this.guidingCharacteristic = await this.ble.getCharacteristic(this.primaryService, GUIDING_CHARACT);

    this.ble.observeValue$(this.guidingCharacteristic).pipe(map(this.decoder)).subscribe(value => {
      this.paramSource.next(value);
    });

  }

  getDevice() {
    return this.ble.getDevice$();
  }

  setValue(characteristic: BluetoothCharacteristicUUID, value: any) {
    return this.ble.setCharacteristicState(BLE_SERVICE, characteristic, this.str2ab(value));
  }

  disconnectDevice() {
    this.ble.disconnectDevice();
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
