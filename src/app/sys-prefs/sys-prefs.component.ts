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
  selector: 'sys-prefs',
  templateUrl: './sys-prefs.component.html',
  styleUrls: ['./sys-prefs.component.css'],
  providers: PROVIDERS
})
export class SysPrefsComponent implements OnInit, OnDestroy {
  valuesSubscription: Subscription;
  streamSubscription: Subscription;
  characteristic = '00001a02-0000-1000-8000-00805f9b34fb';

  value = {
    DEBUG: 0,
    BUZZER_ENABLE: 0,
    MEMORY_CARD_ENABLED: 0,
    DATA_RECOVERY_MODE: 0,
    FORMAT_MEMORY: 0,
    corrEn: 0,
    corrTime: 0,
    corrRate: 0,
    launchDetect: 0,
  };

   //   // PREFERENCES
    // uint8_t DEBUG; // 1                                  // Set to 1 to read collected data from memory: 0 to save data to memory
    // uint8_t BUZZER_ENABLE; // 0                          // Set to 1 to enable the buzzer. Set to 0 otherwise.
    // uint8_t MEMORY_CARD_ENABLED; // 1                    // Set to 1 to activate the logging system.  0 to disable it (for testing)
    // uint8_t DATA_RECOVERY_MODE; // 1                     // Set to 1 to read collected data from memory: 0 to save data to memory
    // uint8_t FORMAT_MEMORY; // 0    

  MESSAGE_KEY = {
    DEBUG: 'SET DEBUG ',
    BUZZER: 'SET BUZZER ',
    MEMORY_CARD_ENABLED: 'SET MEM_ENABLED ',
    DATA_RECOVERY_MODE: 'SET DATA_MODE ',
    FORMAT_MEMORY: 'SET FORMAT_MEM ',
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

        const enc = new TextDecoder('utf-8');
        const decoded = _.split(enc.decode(value), '|');

        return {
          DEBUG: decoded[0],
          BUZZER_ENABLE: decoded[1],
          MEMORY_CARD_ENABLED: decoded[2],
          DATA_RECOVERY_MODE: decoded[3],
          FORMAT_MEMORY: decoded[4],
          // corrEn: decoded[0],
          // corrTime: decoded[1],
          // corrRate: decoded[2],
          // launchDetect: decoded[3],
        };
      },
      // service: "ef680400-9b35-4933-9b10-52ffa9740042",
      // characteristic: "ef680405-9b35-4933-9b10-52ffa9740042"
      service: '00001700-0000-1000-8000-00805f9b34fb',
      characteristic: '00001a02-0000-1000-8000-00805f9b34fb'
    });
  }

  ngOnInit() {
    this.streamSubscription = this.service.stream()
      .subscribe(this.updateValue.bind(this), this.hasError.bind(this));
  }

  requestValue() {
    this.valuesSubscription = this.service.value(this.characteristic)
      .subscribe(null, this.hasError.bind(this));
  }

  // updateValue(value: { time: number, count: number, raw: any }) {
  updateValue(value) {
    console.log('Reading step counter ', value);
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

  update(message: string, value: any) {
    console.log(`Received message: ${message}  Value: ${value}`);
    this.service.setValue(0x1a01, `${message}${value}`);
    // this.service.setValue('00001a01-0000-1000-8000-00805f9b34fb', `${message}${value}`);
  }

  ngOnDestroy() {
    if (this.valuesSubscription) {
      this.valuesSubscription.unsubscribe();
    }

    if (this.streamSubscription) {
      this.streamSubscription.unsubscribe();
    }
  }

}
