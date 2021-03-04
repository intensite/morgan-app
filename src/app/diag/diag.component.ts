import { Component, OnInit, OnDestroy } from '@angular/core';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
// import { BleService } from '../ble.service';
import { WebsocketService } from '../websocket.service';
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
        HUM: 0, VOLT: 0, STATE:0
    };

    states = [
        {stateID: 0, desc: 'LAUNCH_PAD'}, 
        {stateID: 1, desc: 'ARMED'}, 
        {stateID: 2, desc: 'TRUST_ST1'}, 
        {stateID: 3, desc: 'COASTING_INTER'}, 
        {stateID: 4, desc: 'TRUST_ST2'}, 
        {stateID: 5, desc: 'COASTING'}, 
        {stateID: 6, desc: 'DESCENT'}, 
        {stateID: 7, desc: 'CHUTE_DESCENT'}, 
        {stateID: 8, desc: 'LANDED'}
    ];

    armed_state_text: string = "Déarmé";
    armed_state_status: boolean  = false;
    manualMode_status: boolean  = false;

    manual_state;
    
    // constructor(public service: BleService) {}
    constructor(public service: WebsocketService) {}
    
    get device() {
        // return this.service.getDevice();
        // this.service.connect();
        return 1;
    }


    decoder(value: any) {
        const MESSAGE_TYPE = 0;                     // Used to differenciate between different types of messages
        const PITCH_AXIS = 2;                       // MPU-6050 Axis when mounted on rocket configuration (X Axis when flat)
        const YAW_AXIS = 1;                         // MPU-6050 Axis when mounted on rocket configuration (Z Axis when flat)
        const ROLL_AXIS = 3;                        // MPU-6050 Axis when mounted on rocket configuration (Y Axis when flat)
        const ACC_X = 4;                            // ACCELEROMETER_X AXIS
        const ACC_Y = 5;                            // ACCELEROMETER_Y AXIS
        const ACC_Z = 6;                            // ACCELEROMETER_Z AXIS
        const ALTI = 7;                             // ALTITUDE
        const TEMPC = 8;                            // TEMPERATURE
        const PRESS = 9;                            // PRESSURE IN KPA
        const HUMID = 10;                           // HUMIDITY
        const VOLTAGE = 11;                         // VOLTAGE
        const CURRENT_STATE = 12;                   // STATE


        let empty_message = {
            X: 0, Y: 0, Z: 0,
            AX: 0, AY: 0, AZ: 0,
            ALT: 0, TEMP: 0, KPA: 0,
            HUM: 0, VOLT: 0, STATE: 0
        };

        if(typeof(value) == "object"){
                const decoded = _.split(value.data, '|');
                
                return {
                    X: decoded[PITCH_AXIS], Y: decoded[YAW_AXIS], Z: decoded[ROLL_AXIS],
                    AX: decoded[ACC_X], AY: decoded[ACC_Y], AZ: decoded[ACC_Z],
                    ALT: decoded[ALTI], TEMP: decoded[TEMPC], KPA: decoded[PRESS],
                    HUM: decoded[HUMID], VOLT: decoded[VOLTAGE], STATE: decoded[CURRENT_STATE]
                };
        } else {
            return empty_message;
        }
    }

    ngOnInit() {
        this.valuesSubscription = this.service.diagValue.pipe(map(this.decoder)).subscribe(this.updateValue.bind(this), this.hasError.bind(this));
    }

    toggle_armed_state() {
        if(this.armed_state_status) {
            this.armed_state_status = false;
            this.armed_state_text = 'Fusée Déarmé'
            this.service.setValue(0x1a01, 'SET ARMED_STATUS 0',);
        } else {
            this.armed_state_status = true;
            this.armed_state_text = 'Fusée Armé'
            this.service.setValue(0x1a01, 'SET ARMED_STATUS 1',);
        }

    }

    onManualStateChange(event) {
        this.manual_state = event.target.value;
        console.log(this.manual_state);
        this.service.setValue(0x1a01, `SET MANUAL_STATE ${this.manual_state}`,);
    }

    toggleManualState() {
        this.manualMode_status = !this.manualMode_status;
        if(!this.manualMode_status) {
            this.manual_state= -1;
            this.service.setValue(0x1a01, `SET MANUAL_STATE "${this.manual_state}"`,);  // Quotes are necessary for negative numbers arguments :-(
        } 
    }


    updateValue(value) {
        this.value = value;
        if(this.value.STATE == 0 && this.armed_state_status) {
            this.toggle_armed_state()
        }

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
