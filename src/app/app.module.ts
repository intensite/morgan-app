import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { WebBluetoothModule } from '@manekinekko/angular-web-bluetooth';
import * as _ from 'lodash';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DiagComponent } from './diag/diag.component';
import { SysPrefsComponent } from './sys-prefs/sys-prefs.component';

@NgModule({
  declarations: [
    AppComponent,
    DiagComponent,
    SysPrefsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    WebBluetoothModule.forRoot({
      enableTracing: false // or false, this will enable logs in the browser's console
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
