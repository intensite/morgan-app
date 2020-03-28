import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { BleService } from '../ble.service';
import * as _ from 'lodash';


@Component({
    selector: 'guidance',
    templateUrl: './guidance.component.html',
    styleUrls: ['./guidance.component.css'],
})
export class GuidanceComponent implements OnInit {

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

    alignementX = 90;
    alignementY = 90;

    constructor(private fb: FormBuilder, public service: BleService) { }

    ngOnInit() {
        this.valuesSubscription = this.service.guidingValue.pipe(map(this.decoder)).subscribe(this.updateValue.bind(this), this.hasError.bind(this));
    }

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

    updateValue(value) {
        this.value = value;
        // this.sysPrefsForm.setValue(this.value);
    }

    disconnect() {
        this.service.disconnectDevice();
        this.valuesSubscription.unsubscribe();
    }

    hasError(error: string) {
    }

    ngOnDestroy() {
        if (this.valuesSubscription) {
            this.valuesSubscription.unsubscribe();
        }
    }
}
