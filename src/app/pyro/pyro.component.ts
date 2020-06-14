import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
// import { BleService } from '../ble.service';
import { WebsocketService } from '../websocket.service';
import * as _ from 'lodash';

@Component({
    selector: 'pyro',
    templateUrl: './pyro.component.html',
    styleUrls: ['./pyro.component.css'],
})

export class PyroComponent implements OnInit, OnDestroy {
    testButtons = [false, false, false, false];

    pyroForm = this.fb.group({
        APOGEE_DIFF_METERS: ["", {updateOn: "blur"}],
        PARACHUTE_DELAY: ["", {updateOn: "blur"}],
        PYRO_ACTIVATION_DELAY: ["", {updateOn: "blur"}],
        PYRO_1_FIRE_ALTITUDE: ["", {updateOn: "blur"}],
        PYRO_2_FIRE_ALTITUDE: ["", {updateOn: "blur"}],
        PYRO_3_FIRE_ALTITUDE: ["", {updateOn: "blur"}],
        PYRO_4_FIRE_ALTITUDE: ["", {updateOn: "blur"}],
        AUTOMATIC_ANGLE_ABORT: "", 
        EXCESSIVE_ANGLE_THRESHOLD: ["", {updateOn: "blur"}],
        EXCESSIVE_ANGLE_TIME: ["", {updateOn: "blur"}],
    });

    valuesSubscription: Subscription;

    value = {
        APOGEE_DIFF_METERS: 0,
        PARACHUTE_DELAY: 0,
        PYRO_ACTIVATION_DELAY: 0,
        PYRO_1_FIRE_ALTITUDE: 0,
        PYRO_2_FIRE_ALTITUDE: 0,
        PYRO_3_FIRE_ALTITUDE: 0,
        PYRO_4_FIRE_ALTITUDE: 0,
        AUTOMATIC_ANGLE_ABORT: 0,
        EXCESSIVE_ANGLE_THRESHOLD: 0,
        EXCESSIVE_ANGLE_TIME: 0,
    };

    MESSAGE_KEY = {
        APOGEE_DIFF_METERS: 'SET APOGEE_DIFF_METERS ',
        PARACHUTE_DELAY: 'SET PARACHUTE_DELAY ',
        PYRO_ACTIVATION_DELAY: 'SET PYRO_ACTIVATION_DELAY ',
        PYRO_1_FIRE_ALTITUDE: 'SET PYRO_1_FIRE_ALTITUDE ',
        PYRO_2_FIRE_ALTITUDE: 'SET PYRO_2_FIRE_ALTITUDE ',
        PYRO_3_FIRE_ALTITUDE: 'SET PYRO_3_FIRE_ALTITUDE ',
        PYRO_4_FIRE_ALTITUDE: 'SET PYRO_4_FIRE_ALTITUDE ',
        AUTOMATIC_ANGLE_ABORT: 'SET AUTOMATIC_ANGLE_ABORT ',
        EXCESSIVE_ANGLE_THRESHOLD: 'SET EXCESSIVE_ANGLE_THRESHOLD ',
        EXCESSIVE_ANGLE_TIME: 'SET EXCESSIVE_ANGLE_TIME ',
                
        FIRE_PYRO_1: 'SET FIRE_PYRO 1',
        FIRE_PYRO_2: 'SET FIRE_PYRO 2',
        FIRE_PYRO_3: 'SET FIRE_PYRO 3',
        FIRE_PYRO_4: 'SET FIRE_PYRO 4',
        RESET_PYRO: 'SET RESET_PYRO 1'

    };

    constructor(private fb: FormBuilder, public service: WebsocketService) { }

    ngOnInit() {
        this.valuesSubscription = this.service.pyroValue.pipe(map(this.decoder)).subscribe(this.updateValue.bind(this), this.hasError.bind(this));
    }


    decoder(value: any) {
        // const decoded = _.split(value, '|');
        let decoded = _.split(value.data, '|');
        decoded = decoded.slice(1);  // Get rid of the message type (first item "T3")

        return {
            APOGEE_DIFF_METERS: parseInt(decoded[0], 10),
            PARACHUTE_DELAY: parseInt(decoded[1], 10),
            PYRO_ACTIVATION_DELAY: parseInt(decoded[2], 10),
            PYRO_1_FIRE_ALTITUDE: parseInt(decoded[3], 10),
            PYRO_2_FIRE_ALTITUDE: parseInt(decoded[4], 10),
            PYRO_3_FIRE_ALTITUDE: parseInt(decoded[5], 10),
            PYRO_4_FIRE_ALTITUDE: parseInt(decoded[6], 10),
            AUTOMATIC_ANGLE_ABORT: parseInt(decoded[7], 2) == 1 ? true : false,
            EXCESSIVE_ANGLE_THRESHOLD: parseInt(decoded[8], 10),
            EXCESSIVE_ANGLE_TIME: parseInt(decoded[9], 10),
        };

    }

    updateValue(value) {
        this.value = value;
        // this.pyroForm.setValue(this.value);
    }

    disconnect() {
        this.service.disconnectDevice();
        this.valuesSubscription.unsubscribe();
    }

    hasError(error: string) {}

    update(e) {
        console.log(`The checkbox name is: ${e.target.name}`);
        console.log(e);
        console.log(`${this.MESSAGE_KEY[e.target.name]}`);

        switch (e.target.type) {
            case 'button': 
                this.service.setValue(0x1a01, `${this.MESSAGE_KEY[e.target.name]}`);
            break;
            case 'number': 
                if(Number.isInteger(e.target.valueAsNumber)){
                    this.service.setValue(0x1a01, `${this.MESSAGE_KEY[e.target.name]}"${e.target.value}"`);  // Quotes are necessary for negative numbers arguments :-(
                }
            break;
            case 'checkbox': 
                this.service.setValue(0x1a01, `${this.MESSAGE_KEY[e.target.name]}${e.target.checked ? 1 : 0}`);
            break;
        }
    }

    resetPyros() {
        // Reset the lock checkboxes
        this.testButtons = [false, false, false, false];
        this.service.setValue(0x1a01, this.MESSAGE_KEY.RESET_PYRO);

    }

    ngOnDestroy() {
        if (this.valuesSubscription) {
            this.valuesSubscription.unsubscribe();
        }
    }

}
