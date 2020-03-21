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
  selector: 'sys-prefs',
  templateUrl: './sys-prefs.component.html',
  styleUrls: ['./sys-prefs.component.css'],
  providers: PROVIDERS
})
export class SysPrefsComponent implements OnInit, OnDestroy {

  sysPrefsForm = this.fb.group({
    DEBUG: 0,
    BUZZER_ENABLE: 0,
    MEMORY_CARD_ENABLED: 0,
    DATA_RECOVERY_MODE: 0,
    FORMAT_MEMORY: 0,
  });


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

  //   // PREFERENCES
  // uint8_t DEBUG; // 1                                  // Set to 1 to read collected data from memory: 0 to save data to memory
  // uint8_t BUZZER_ENABLE; // 0                          // Set to 1 to enable the buzzer. Set to 0 otherwise.
  // uint8_t MEMORY_CARD_ENABLED; // 1                    // Set to 1 to activate the logging system.  0 to disable it (for testing)
  // uint8_t DATA_RECOVERY_MODE; // 1                     // Set to 1 to read collected data from memory: 0 to save data to memory
  // uint8_t FORMAT_MEMORY; // 0

  MESSAGE_KEY = {
    DEBUG: 'SET DEBUG ',
    BUZZER_ENABLE: 'SET BUZZER ',
    MEMORY_CARD_ENABLED: 'SET MEM_ENABLED ',
    DATA_RECOVERY_MODE: 'SET DATA_MODE ',
    FORMAT_MEMORY: 'SET FORMAT_MEM ',
  };

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

  ngOnInit() {
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
    this.sysPrefsForm.setValue(this.value);
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
  //   this.service.setValue(0x1a01, `${message}${value}`);
  // }

  update(e) {
    // console.log(`The checkbox name is: ${e.target.name}`);
    // console.log(`The checkbox value is: ${e.target.checked ? 1 : 0}`);
    console.log(`${this.MESSAGE_KEY[e.target.name]}${e.target.checked ? 1 : 0}`);

    this.service.setValue(0x1a01, `${this.MESSAGE_KEY[e.target.name]}${e.target.checked ? 1 : 0}`);
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
