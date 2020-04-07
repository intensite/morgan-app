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

    guidanceForm = this.fb.group({
        GUIDING_TYPE: [1, {updateOn: "blur"}],
        ROLL_CONTROL_ENABLED: [1, {updateOn: "blur"}],
        ROLL_CONTROL_TYPE: ["", {updateOn: "blur"}],

        SERVO_1_AXIS: ["", {updateOn: "blur"}],
        SERVO_2_AXIS: ["", {updateOn: "blur"}],
        SERVO_3_AXIS: ["", {updateOn: "blur"}],
        SERVO_4_AXIS: ["", {updateOn: "blur"}],

        SERVO_1_OFFSET: ["", {updateOn: "blur"}],
        SERVO_2_OFFSET: ["", {updateOn: "blur"}],
        SERVO_3_OFFSET: ["", {updateOn: "blur"}],
        SERVO_4_OFFSET: ["", {updateOn: "blur"}],
        SERVO_1_ORIENTATION: ["", {updateOn: "blur"}],
        SERVO_2_ORIENTATION: ["", {updateOn: "blur"}],
        SERVO_3_ORIENTATION: ["", {updateOn: "blur"}],
        SERVO_4_ORIENTATION: ["", {updateOn: "blur"}],
        MAX_FINS_TRAVEL: ["", {updateOn: "blur"}],

        PID_PITCH_Kp: ["", {updateOn: "blur"}],
        PID_PITCH_Ki: ["", {updateOn: "blur"}],
        PID_PITCH_Kd: ["", {updateOn: "blur"}],

        PID_YAW_Kp: ["", {updateOn: "blur"}],
        PID_YAW_Ki: ["", {updateOn: "blur"}],
        PID_YAW_Kd: ["", {updateOn: "blur"}],
        
        PID_ROLL_Kp: ["", {updateOn: "blur"}],
        PID_ROLL_Ki: ["", {updateOn: "blur"}],
        PID_ROLL_Kd: ["", {updateOn: "blur"}],
    });


    valuesSubscription: Subscription;

    value = {
        GUIDING_TYPE: 0,
        ROLL_CONTROL_ENABLED: 0,
        ROLL_CONTROL_TYPE: 0,

        SERVO_1_AXIS: 0,
        SERVO_2_AXIS: 0,
        SERVO_3_AXIS: 0,
        SERVO_4_AXIS: 0,

        SERVO_1_OFFSET: 0,
        SERVO_2_OFFSET: 0,
        SERVO_3_OFFSET: 0,
        SERVO_4_OFFSET: 0,
        SERVO_1_ORIENTATION: 1,
        SERVO_2_ORIENTATION: 1,
        SERVO_3_ORIENTATION: 1,
        SERVO_4_ORIENTATION: 1,
        MAX_FINS_TRAVEL: 0,

        PID_PITCH_Kp: 0,
        PID_PITCH_Ki: 0,
        PID_PITCH_Kd: 0,

        PID_YAW_Kp: 0,
        PID_YAW_Ki: 0,
        PID_YAW_Kd: 0,
        
        PID_ROLL_Kp: 0,
        PID_ROLL_Ki: 0,
        PID_ROLL_Kd: 0,
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
            GUIDING_TYPE: parseInt(decoded[0], 10),
            ROLL_CONTROL_ENABLED: parseInt(decoded[1], 2) == 1 ? true : false,
            ROLL_CONTROL_TYPE: parseInt(decoded[2], 10),
    
            SERVO_1_AXIS: decoded[3],
            SERVO_2_AXIS: decoded[4],
            SERVO_3_AXIS: decoded[5],
            SERVO_4_AXIS: decoded[6],
    
            SERVO_1_OFFSET: parseInt(decoded[7], 10),
            SERVO_2_OFFSET: parseInt(decoded[8], 10),
            SERVO_3_OFFSET: parseInt(decoded[9], 10),
            SERVO_4_OFFSET: parseInt(decoded[10], 10),

            SERVO_1_ORIENTATION: parseInt(decoded[11], 10),
            SERVO_2_ORIENTATION: parseInt(decoded[12], 10),
            SERVO_3_ORIENTATION: parseInt(decoded[13], 10),
            SERVO_4_ORIENTATION: parseInt(decoded[14], 10),
            MAX_FINS_TRAVEL: parseInt(decoded[15], 10),
    
            PID_PITCH_Kp: parseFloat(decoded[16]),
            PID_PITCH_Ki: parseFloat(decoded[17]),
            PID_PITCH_Kd: parseFloat(decoded[18]),
    
            PID_YAW_Kp: parseFloat(decoded[19]),
            PID_YAW_Ki: parseFloat(decoded[20]),
            PID_YAW_Kd: parseFloat(decoded[21]),
            
            PID_ROLL_Kp: parseFloat(decoded[22]),
            PID_ROLL_Ki: parseFloat(decoded[23]),
            PID_ROLL_Kd: parseFloat(decoded[24]),

        };
    }

    updateValue(value) {
        this.value = value;
        this.guidanceForm.setValue(this.value);
    }

    disconnect() {
        this.service.disconnectDevice();
        this.valuesSubscription.unsubscribe();
    }

    hasError(error: string) {
    }

    update(e) {}


    ngOnDestroy() {
        if (this.valuesSubscription) {
            this.valuesSubscription.unsubscribe();
        }
    }
}
