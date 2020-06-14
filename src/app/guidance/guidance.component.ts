import { Component, OnInit, OnDestroy, ɵConsole } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { map, endWith } from 'rxjs/operators';
import { Subscription } from 'rxjs';
// import { BleService } from '../ble.service';
import { WebsocketService } from '../websocket.service';
import * as _ from 'lodash';


@Component({
    selector: 'guidance',
    templateUrl: './guidance.component.html',
    styleUrls: ['./guidance.component.css'],
})
export class GuidanceComponent implements OnInit {

    guidanceForm = this.fb.group({
        GUIDING_TYPE: [1, { updateOn: "blur" }],
        ROLL_CONTROL_ENABLED: [1, { updateOn: "blur" }],
        ROLL_CONTROL_TYPE: ["", { updateOn: "blur" }],

        SERVO_1_AXIS: ["", { updateOn: "blur" }],
        SERVO_2_AXIS: ["", { updateOn: "blur" }],
        SERVO_3_AXIS: ["", { updateOn: "blur" }],
        SERVO_4_AXIS: ["", { updateOn: "blur" }],

        SERVO_1_OFFSET: ["", { updateOn: "blur" }],
        SERVO_2_OFFSET: ["", { updateOn: "blur" }],
        SERVO_3_OFFSET: ["", { updateOn: "blur" }],
        SERVO_4_OFFSET: ["", { updateOn: "blur" }],
        SERVO_1_ORIENTATION: [-1, { updateOn: "click" }],
        SERVO_2_ORIENTATION: [-1, { updateOn: "click" }],
        SERVO_3_ORIENTATION: [-1, { updateOn: "click" }],
        SERVO_4_ORIENTATION: [-1, { updateOn: "click" }],
        MAX_FINS_TRAVEL: ["", { updateOn: "blur" }],

        PID_PITCH_Kp: ["", { updateOn: "blur" }],
        PID_PITCH_Ki: ["", { updateOn: "blur" }],
        PID_PITCH_Kd: ["", { updateOn: "blur" }],

        PID_YAW_Kp: ["", { updateOn: "blur" }],
        PID_YAW_Ki: ["", { updateOn: "blur" }],
        PID_YAW_Kd: ["", { updateOn: "blur" }],

        PID_ROLL_Kp: ["", { updateOn: "blur" }],
        PID_ROLL_Ki: ["", { updateOn: "blur" }],
        PID_ROLL_Kd: ["", { updateOn: "blur" }],
    });


    valuesSubscription: Subscription;
    ADJUSTMENT_FACTOR: number;

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

    constructor(private fb: FormBuilder, public service: WebsocketService) { 
        this.ADJUSTMENT_FACTOR = 1;
    }

    ngOnInit() {
        this.valuesSubscription = this.service.guidingValue.pipe(map(this.decoder)).subscribe(this.updateValue.bind(this), this.hasError.bind(this));
    }

    decoder(value: any) {
        // const decoded = _.split(value, '|');
        let decoded = _.split(value.data, '|');
        decoded = decoded.slice(1);  // Get rid of the message type (first item "T3")

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

    changeServoOfset(servo: number, direction: number) {

        let factor = this.ADJUSTMENT_FACTOR;
        let newValue;
        switch (servo) {
            case 1:
                newValue = this.value.SERVO_1_OFFSET + (factor * direction);
                console.log(`Facteur: ${factor}, newValue: ${newValue}`);
                this.service.setValue(0x1a01, `${this.MESSAGE_KEY.SERVO_1_OFFSET}"${newValue}"`);
                break;
            case 2:
                newValue = this.value.SERVO_2_OFFSET + (factor * direction);
                this.service.setValue(0x1a01, `${this.MESSAGE_KEY.SERVO_2_OFFSET}"${newValue}"`);
                break;
            case 3:
                newValue = this.value.SERVO_3_OFFSET + (factor * direction);
                this.service.setValue(0x1a01, `${this.MESSAGE_KEY.SERVO_3_OFFSET}"${newValue}"`);
                break;
            case 4:
                newValue = this.value.SERVO_4_OFFSET + (factor * direction);
                this.service.setValue(0x1a01, `${this.MESSAGE_KEY.SERVO_4_OFFSET}"${newValue}"`);
                break;
        }
    }

    updateValue(value) {
        this.value = value;
        console.log(value);
        this.guidanceForm.setValue(this.value);
    }

    disconnect() {
        this.service.disconnectDevice();
        this.valuesSubscription.unsubscribe();
    }

    hasError(error: string) {
    }

    update(e) {
        console.log(`The control name is: ${e.target.name}`);
        console.log(e);
        console.log(`${this.MESSAGE_KEY[e.target.name]}"${e.target.value}"`);

        switch (e.target.type) {
            case 'button': 
                this.service.setValue(0x1a01, `${this.MESSAGE_KEY[e.target.name]}`);
            break;
            case 'number': 
                if(!Number.isNaN(e.target.valueAsNumber)){
                    this.service.setValue(0x1a01, `${this.MESSAGE_KEY[e.target.name]}"${e.target.value}"`);  // Quotes are necessary for negative numbers arguments :-(
                }
            break;
            case 'checkbox': 
                this.service.setValue(0x1a01, `${this.MESSAGE_KEY[e.target.name]}${e.target.checked ? 1 : 0}`);
            break;
            case 'radio': 
                this.service.setValue(0x1a01, `${this.MESSAGE_KEY[e.target.name]}"${e.target.value}"`);
            break;
        }
    }


    ngOnDestroy() {
        if (this.valuesSubscription) {
            this.valuesSubscription.unsubscribe();
        }
    }

    MESSAGE_KEY = {
        SERVO_1_OFFSET: 'SET SERVO_1_OFFSET ',
        SERVO_2_OFFSET: 'SET SERVO_2_OFFSET ',
        SERVO_3_OFFSET: 'SET SERVO_3_OFFSET ',
        SERVO_4_OFFSET: 'SET SERVO_4_OFFSET ',

        GUIDING_TYPE: 'SET GUIDING_TYPE ',
        SERVO_1_ORIENTATION: 'SET SERVO_1_ORIENTATION ',
        SERVO_2_ORIENTATION: 'SET SERVO_2_ORIENTATION ',
        SERVO_3_ORIENTATION: 'SET SERVO_3_ORIENTATION ',
        SERVO_4_ORIENTATION: 'SET SERVO_4_ORIENTATION ',

        SERVO_1_AXIS: 'SET SERVO_1_AXIS ',
        SERVO_2_AXIS: 'SET SERVO_2_AXIS ',
        SERVO_3_AXIS: 'SET SERVO_3_AXIS ',
        SERVO_4_AXIS: 'SET SERVO_4_AXIS ',

        PID_PITCH_Kp: 'SET PID_PITCH_Kp ',
        PID_PITCH_Ki: 'SET PID_PITCH_Ki ',
        PID_PITCH_Kd: 'SET PID_PITCH_Kd ',

        PID_YAW_Kp: 'SET PID_YAW_Kp ',
        PID_YAW_Ki: 'SET PID_YAW_Ki ',
        PID_YAW_Kd: 'SET PID_YAW_Kd ',

        PID_ROLL_Kp: 'SET PID_ROLL_Kp ',
        PID_ROLL_Ki: 'SET PID_ROLL_Ki ',
        PID_ROLL_Kd: 'SET PID_ROLL_Kd ',

    };

}
