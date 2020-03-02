import { filter } from 'rxjs/operators';
import { element } from 'protractor';
import { Store } from '@ngxs/store';
import { FlightState } from './../service/flight.state';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.scss']
})
export class CheckInComponent implements OnInit {

  id;
  flightDetails;
  selectedFlight;
  selectedPassenger;
  passengerDetails;
  filter = [
    { checked: false, label: 'Checked-in' },
    { checked: false, label: 'Pending check-in' },
    { checked: false, label: 'Wheel-chair' },
    { checked: false, label: 'Infants' }
  ];
  selectedSeat;
  status;
  ancillary = [];
  vacantSeats = [];

  @ViewChild('changeSeatDialog', { static: false }) changeSeatDialog: TemplateRef<any>;
  @ViewChild('changeStatusDialog', { static: false }) changeStatusDialog: TemplateRef<any>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.flightDetails = this.store.selectSnapshot(FlightState.getFlights);
    this.route.params.subscribe(params => {
      this.id = +params['flightId']; // (+) converts string 'id' to a number         
      console.log(this.id);
    });
    this.selectedFlight = this.flightDetails[this.id];
    this.passengerDetails = JSON.parse(JSON.stringify(this.selectedFlight.passengersDetail));
    this.selectedFlight.passengersDetail.forEach(element => {
      this.ancillary.push(element.ancilliaryServices.toString().replace(/,/g, ', '));
    });
    console.log(this.selectedFlight);
  }

  changeSeat(index) {
    const passenger = this.passengerDetails[index];
    const details = JSON.parse(JSON.stringify(this.selectedFlight.seatsDetail));
    details.forEach(element => {
      if (passenger.seatNumber === element.number) {
        this.selectedSeat = element.number;
        element.isOccupied = false;
      }
      if (!element.isOccupied) {
        this.vacantSeats.push(element);
      }
    });
    this.selectedPassenger = passenger.name;
    const dialogRef = this.dialog.open(this.changeSeatDialog, { width: '300px' });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result === 'yes' && passenger.seatNumber !== this.selectedSeat) {
          this.selectedFlight.seatsDetail.forEach(element => {
            element.isOccupied = (passenger.seatNumber === element.number) ? false : element.isOccupied;
            element.isOccupied = (element.number === this.selectedSeat) ? true : element.isOccupied;
          });
          this.passengerDetails[index].seatNumber = this.selectedSeat;
        }
      }
    });
  }

  changeStatus(seat) {
    this.selectedPassenger = '';
    this.passengerDetails.forEach(element => {
      if (element.seatNumber === seat.number) {
        this.selectedPassenger = element.name;
        this.status = element.isCheckedIn;
      }
    });
    const dialogRef = this.dialog.open(this.changeStatusDialog, { width: '300px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result === 'yes') {
          this.passengerDetails.forEach(element => {
            if (element.seatNumber === seat.number) {
              element.isCheckedIn = this.status;
            }
          });
          console.log(this.selectedFlight.passengersDetail);
        }
      }
    });
  }

  filterPassenger(criteria) {
    console.log(criteria);
    // if (criteria.label === 'Checked-in') {
    //   this.passengerDetails = (criteria.checked === true) ? this.selectedFlight.passengersDetail.filter(detail => detail.isCheckedIn):
    //   this.selectedFlight.passengersDetail
    // }

    // if (criteria.label === 'Pending check-in') {
    //   this.passengerDetails = (criteria.checked === true) ? this.selectedFlight.passengersDetail.filter(detail => !detail.isCheckedIn):
    //   this.selectedFlight.passengersDetail.filter(detail => detail.isCheckedIn)
    // }

    // if (criteria.label === 'Wheel-chair') {
    //   this.passengerDetails = (criteria.checked === true) ? this.selectedFlight.passengersDetail.filter(detail => detail.isWheelChairRequired):
    //   this.selectedFlight.passengersDetail.filter(detail => !detail.isWheelChairRequired)
    // }

    // if (criteria.label === 'Infants') {
    //   this.passengerDetails = (criteria.checked === true) ? this.selectedFlight.passengersDetail.filter(detail => detail.hasInfant):
    //   this.selectedFlight.passengersDetail.filter(detail => !detail.hasInfant)
    // }
  }

}
