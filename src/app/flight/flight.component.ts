import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FlightService } from './service/flight.service';

@Component({
  selector: 'app-flight',
  templateUrl: './flight.component.html',
  styleUrls: ['./flight.component.scss']
})
export class FlightComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private flightService: FlightService
  ) { }

  private unsubscribe$ = new Subject();

  ngOnInit(): void {
    this.serviceCall();
  }

  serviceCall(): void {
    this.flightService
      .getFlights().pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        res => {
          console.log(res);
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
