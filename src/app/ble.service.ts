import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { BluetoothCore, BrowserWebBluetooth, ConsoleLoggerService } from '@manekinekko/angular-web-bluetooth';

interface ServiceOptions {
    characteristic: string;
    service: string;
    // decoder(value: DataView): number | {[key: string]: number}
    decoder(value: DataView): any;
}

@Injectable({
  providedIn: 'root'
})
export class BleService {

    private _config: ServiceOptions;

  constructor(public ble: BluetoothCore) { }

  config(options: ServiceOptions) {
    this._config = options;
  }

  getDevice() {
    return this.ble.getDevice$();
  }

  stream() {
    return this.ble.streamValues$().pipe(
      map(this._config.decoder)
    );
  }

  value(charact) {
    return this.ble
      .value$({
        service: this._config.service,
        // characteristic: this._config.characteristic
        characteristic: charact
      });
  }

  setValue(characteristic: BluetoothCharacteristicUUID, value: any) {
    return this.ble.setCharacteristicState(this._config.service, characteristic, this.str2ab(value));
  }

  disconnectDevice() {
    this.ble.disconnectDevice();
  }

  str2ab(str) {
    let buf = new ArrayBuffer(str.length); // 2 bytes for each char
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }
}
