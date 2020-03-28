import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { BleService } from '../ble.service';
import * as _ from 'lodash';


@Component({
  selector: 'sys-prefs',
  templateUrl: './sys-prefs.component.html',
  styleUrls: ['./sys-prefs.component.css'],
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

  constructor(private fb: FormBuilder, public service: BleService) { }

  decoder(value: string) {
    const decoded = _.split(value, '|');

    return {
      DEBUG: parseInt(decoded[0], 2) == 1 ? true : false,
      BUZZER_ENABLE: parseInt(decoded[1], 2) == 1 ? true : false,
      MEMORY_CARD_ENABLED: parseInt(decoded[2], 2) == 1 ? true : false,
      DATA_RECOVERY_MODE: parseInt(decoded[3], 2) == 1 ? true : false,
      FORMAT_MEMORY: parseInt(decoded[4], 2) == 1 ? true : false,
    };
  }

  ngOnInit() {
    this.valuesSubscription = this.service.paramValue.pipe(map(this.decoder)).subscribe(this.updateValue.bind(this), this.hasError.bind(this));
  }

  updateValue(value) {
    this.value = value;
    this.sysPrefsForm.setValue(this.value);
  }

  disconnect() {
    this.service.disconnectDevice();
    this.valuesSubscription.unsubscribe();
  }

  hasError(error: string) {}

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
  }

}
