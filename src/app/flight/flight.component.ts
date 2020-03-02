import { FlightState } from './service/flight.state';
import { AddFlight } from './service/flight.action';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { FlightService } from './service/flight.service';
import { Flight } from './service/flight.model';
import { MatExpansionPanelTitle } from '@angular/material';
import { AuthService } from '../auth/auth.service';
import { Store } from "@ngxs/store";

@Component({
  selector: 'app-flight',
  templateUrl: './flight.component.html',
  styleUrls: ['./flight.component.scss']
})
export class FlightComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router,
    private flightService: FlightService,
    private authService: AuthService,
    private store: Store
  ) { }

  private unsubscribe$ = new Subject();

  flightDetails: Flight[];
  private flag = '';

  ngOnInit(): void {
    this.flag = this.authService.fetchAuthStatusListener();
    this.flightDetails = this.store.selectSnapshot(FlightState.getFlights);
    if (!this.flightDetails) { this.serviceCall(); }
  }

  serviceCall(): void {
    this.flightService
      .getFlights().pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        res => {
          this.flightDetails = res;
          this.store.dispatch(new AddFlight(this.flightDetails));
          console.log('====>>',this.store.selectSnapshot(FlightState.getFlights));
                    
        },
        error => {
          console.log(error);
        }
      );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  navigateTo(index, type) {
    if (type === 'checkIn') {
      this.router.navigate([`/flights/${index}/check-in`]);
    } else {
      this.router.navigate([`/flights/${index}/in-flight`]);
    }
  }

  onManageClick(i: number): void {
    this.router.navigate([`/flights/${i}/admin/home`]);
  }
}
