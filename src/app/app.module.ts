import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { WebBluetoothModule } from '@manekinekko/angular-web-bluetooth';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import * as _ from 'lodash';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SysPrefsComponent } from './sys-prefs/sys-prefs.component';
import { DiagComponent } from './diag/diag.component';
import { PyroComponent } from './pyro/pyro.component';
import { GuidanceComponent } from './guidance/guidance.component';
import { DataComponent } from './data/data.component';

@NgModule({
  declarations: [
    AppComponent,
    SysPrefsComponent,
    DiagComponent,
    PyroComponent,
    GuidanceComponent,
    DataComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule, 
    AppRoutingModule,
    WebBluetoothModule.forRoot({
      enableTracing: false // or false, this will enable logs in the browser's console
    }),
    FontAwesomeModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
