import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FlightService } from './service/flight.service';
import { Flight } from './service/flight.model';
import { MatExpansionPanelTitle } from '@angular/material';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-flight',
  templateUrl: './flight.component.html',
  styleUrls: ['./flight.component.scss']
})
export class FlightComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private flightService: FlightService,
    private authService: AuthService
  ) { }

  private unsubscribe$ = new Subject();

  flightDetails: Flight[];
  private flag = '';

  ngOnInit(): void {
    this.flag = this.authService.fetchAuthStatusListener();
    this.serviceCall();
  }

  serviceCall(): void {
    this.flightService
      .getFlights().pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        res => {
          this.flightDetails = res;
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
}
