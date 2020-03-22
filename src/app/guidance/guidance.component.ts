import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
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
  selector: 'guidance',
  templateUrl: './guidance.component.html',
  styleUrls: ['./guidance.component.css'],
  providers: PROVIDERS
})
export class GuidanceComponent implements OnInit {

  valuesSubscription: Subscription;
  streamSubscription: Subscription;
  characteristic = '00001a02-0000-1000-8000-00805f9b34fb';

  value = {
    DEBUG: 0,
    BUZZER_ENABLE: 0,
    MEMORY_CARD_ENABLED: 0,
    DATA_RECOVERY_MODE: 0,
    FORMAT_MEMORY: 0,
    // corrEn: 0,
    // corrTime: 0,
    // corrRate: 0,
    // launchDetect: 0,
  };

  alignementX = 90;
  alignementY = 90;

  get device() {
    return this.service.getDevice();
  }


  constructor(private fb: FormBuilder, public service: BleService) {
    service.config({
      decoder: (value: DataView) => {
        const enc = new TextDecoder('utf-8');
        const decoded = _.split(enc.decode(value), '|');

        return {
          DEBUG: parseInt(decoded[0], 2) == 1 ? true : false,
          BUZZER_ENABLE: parseInt(decoded[1], 2) == 1 ? true : false,
          MEMORY_CARD_ENABLED: parseInt(decoded[2], 2) == 1 ? true : false,
          DATA_RECOVERY_MODE: parseInt(decoded[3], 2) == 1 ? true : false,
          FORMAT_MEMORY: parseInt(decoded[4], 2) == 1 ? true : false,
        };
      },
      service: '00001700-0000-1000-8000-00805f9b34fb',
      characteristic: '00001a02-0000-1000-8000-00805f9b34fb'
    });
  }

  ngOnInit(): void {
    this.streamSubscription = this.service.stream()
    .subscribe(this.updateValue.bind(this), this.hasError.bind(this));
  }

  requestValue() {
    this.valuesSubscription = this.service.value(this.characteristic)
      .subscribe(null, this.hasError.bind(this));
  }

  updateValue(value) {
    // console.log('Receiving vales: ', value);  // DEBUG
    this.value = value;
    // this.sysPrefsForm.setValue(this.value);
  }

  disconnect() {
    this.service.disconnectDevice();
    this.valuesSubscription.unsubscribe();
  }

  hasError(error: string) {
    // this.snackBar.open(error, 'Close');
  }

}
