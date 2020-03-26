import { Component, OnInit, OnDestroy } from '@angular/core';
import { BluetoothCore, BrowserWebBluetooth, ConsoleLoggerService } from '@manekinekko/angular-web-bluetooth';
import { Subscription } from 'rxjs';
import { BleService } from '../ble.service';
import * as _ from 'lodash';


// make sure we get a singleton instance of each service
const PROVIDERS = [{
  provide: BluetoothCore,
  useFactory: (b, l) => new BluetoothCore(b, l),
  deps: [BrowserWebBluetooth, ConsoleLoggerService]
}, {
  provide: BleService,
  useFactory: (b) => new BleService(b),
  deps: [BluetoothCore]
}];

@Component({
  selector: 'app-diag',
  templateUrl: './diag.component.html',
  styleUrls: ['./diag.component.css'],
  providers: PROVIDERS
})
export class DiagComponent implements OnInit, OnDestroy {
  valuesSubscription: Subscription;
  streamSubscription: Subscription;
  value = {
    X: 0, Y: 0, Z: 0,
    AX: 0, AY: 0, AZ: 0,
    ALT: 0, TEMP: 0, KPA: 0,
    HUM: 0, VOLT: 0
  };


  get device() {
    return this.service.getDevice();
  }


  constructor(public service: BleService) {
    service.config({
      decoder: (value: DataView) => {
        // const count = value.getUint32(0, true);
        // const time = value.getUint32(4, true);
        // const raw = value;
        const YAW_AXIS = 0;                         // MPU-6050 Axis when mounted on rocket configuration (Z Axis when flat)
        const ROLL_AXIS = 1;
        const PITCH_AXIS = 2;                       // MPU-6050 Axis when mounted on rocket configuration (Y Axis when flat)
        const ACC_X = 3;                            // ACCELEROMETER_X AXIS
        const ACC_Y = 4;                            // ACCELEROMETER_Y AXIS
        const ACC_Z = 5;                            // ACCELEROMETER_Z AXIS
        const ALTI = 6;                             // ALTITUDE
        const TEMPC = 7;                             // TEMPERATURE
        const PRESS = 8;                            // PRESSURE IN KPA
        const HUMID = 9;                            // HUMIDITY
        const VOLTAGE = 10;                         // VOLTAGE

        const enc = new TextDecoder('utf-8');
        const decoded = _.split(enc.decode(value), '|');

        return {
          X: decoded[YAW_AXIS], Y: decoded[PITCH_AXIS], Z: decoded[ROLL_AXIS],
          AX: decoded[ACC_X], AY: decoded[ACC_Y], AZ: decoded[ACC_Z],
          ALT: decoded[ALTI], TEMP: decoded[TEMPC], KPA: decoded[PRESS],
          HUM: decoded[HUMID], VOLT: decoded[VOLTAGE]
        };
      },
      // service: "ef680400-9b35-4933-9b10-52ffa9740042",
      // characteristic: "ef680405-9b35-4933-9b10-52ffa9740042"
      service: '00001700-0000-1000-8000-00805f9b34fb',
      characteristic: '00001a00-0000-1000-8000-00805f9b34fb'
    });
  }

  ngOnInit() {
    this.streamSubscription = this.service.stream()
      .subscribe(this.updateValue.bind(this), this.hasError.bind(this));
  }

  requestValue() {
    this.valuesSubscription = this.service.value(0x1a00)
      .subscribe(null, this.hasError.bind(this));
  }

  // updateValue(value: { time: number, count: number, raw: any }) {
  updateValue(value) {
    // console.log('Reading step counter ', value);
    // this.value = value.raw;
    this.value = value;
  }

  disconnect() {
    this.service.disconnectDevice();
    this.valuesSubscription.unsubscribe();
  }

  hasError(error: string) {
    // this.snackBar.open(error, 'Close');
  }

  // update(message: string, value: any) {
  //   console.log(`Received message: ${message}  Value: ${value}`);
  //   this.service.setValue('00001a01-0000-1000-8000-00805f9b34fb', 'SET BUZZER 1' );
  // }

  ngOnDestroy() {
    if (this.valuesSubscription) {
      this.valuesSubscription.unsubscribe();
    }

    if (this.streamSubscription) {
      this.streamSubscription.unsubscribe();
    }
  }

}
