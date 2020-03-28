import { Component, OnInit, OnDestroy } from '@angular/core';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { BleService } from '../ble.service';
import * as _ from 'lodash';

@Component({
    selector: 'app-diag',
    templateUrl: './diag.component.html',
    styleUrls: ['./diag.component.css'],
})
export class DiagComponent implements OnInit, OnDestroy {
    valuesSubscription: Subscription;
    value = {
        X: 0, Y: 0, Z: 0,
        AX: 0, AY: 0, AZ: 0,
        ALT: 0, TEMP: 0, KPA: 0,
        HUM: 0, VOLT: 0
    };
    
    constructor(public service: BleService) {}
    
    get device() {
        return this.service.getDevice();
    }


    decoder(value: string) {
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

        const decoded = _.split(value, '|');

        return {
            X: decoded[YAW_AXIS], Y: decoded[PITCH_AXIS], Z: decoded[ROLL_AXIS],
            AX: decoded[ACC_X], AY: decoded[ACC_Y], AZ: decoded[ACC_Z],
            ALT: decoded[ALTI], TEMP: decoded[TEMPC], KPA: decoded[PRESS],
            HUM: decoded[HUMID], VOLT: decoded[VOLTAGE]
        };
    }

    ngOnInit() {
        this.valuesSubscription = this.service.diagValue.pipe(map(this.decoder)).subscribe(this.updateValue.bind(this), this.hasError.bind(this));
    }


    updateValue(value) {
        this.value = value;
    }

    disconnect() {
        this.service.disconnectDevice();
        this.valuesSubscription.unsubscribe();
    }

    hasError(error: string) {}

    ngOnDestroy() {
        if (this.valuesSubscription) {
            this.valuesSubscription.unsubscribe();
        }
    }

}
