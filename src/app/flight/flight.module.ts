import { FlightState } from './service/flight.state';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightComponent } from './flight.component';
import { FlightRoutingModule } from './flight-routing.module';
import { CheckInComponent } from './check-in/check-in.component';
import { InFlightComponent } from './in-flight/in-flight.component';
import { environment } from 'src/environments/environment';
import { MaterialModule } from '../shared/modules/material.module';
import { NgxsModule } from "@ngxs/store";
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [FlightComponent, CheckInComponent, InFlightComponent],
  imports: [
    CommonModule,
    FlightRoutingModule,
    FormsModule,
    NgxsModule.forRoot([
      FlightState
    ]),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot(),
    MaterialModule
  ],
  exports: [FlightComponent]
})
export class FlightModule { }
