import { FlightService } from './../service/flight.service';
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
    public dialog: MatDialog,
    private flightService: FlightService,
  ) { }

  ngOnInit(): void {
    this.flightDetails = this.store.selectSnapshot(FlightState.getFlights);
    this.route.params.subscribe(params => {
      this.id = +params['flightId']; // (+) converts string 'id' to a number         
    });
    this.selectedFlight = this.flightDetails[this.id];
    this.passengerDetails = JSON.parse(JSON.stringify(this.selectedFlight.passengersDetail));
    this.selectedFlight.passengersDetail.forEach(element => {
      this.ancillary.push(element.ancilliaryServices.toString().replace(/,/g, ', '));
    });
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
          this.selectedFlight.passengersDetail[index].seatNumber = this.selectedSeat;
          this.passengerDetails[index].seatNumber = this.selectedSeat;
          
          this.flightService.changeSeat(this.id, this.selectedFlight).subscribe(res => {
            console.log('Seat changed');
          },
            error => console.log(error));
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
          this.selectedFlight.passengersDetail = this.passengerDetails;
          this.flightService.changeStatus(this.id, this.selectedFlight).subscribe(res => {
            console.log('status changed');
          },
            error => console.log(error));
        }
      }
    });
  }

  filterCount() {
    let count = 0;
    this.filter.forEach(element => {
      element.checked ? count++ : count;
    });
    return count;
  }

  filterCriterias() {
    let criteria = [];
    this.filter.forEach(element => {
      element.checked ? criteria.push(element) : criteria;
    });
    return criteria;
  }

  filterPassenger() {
    const options = this.filterCriterias();
    if (this.filterCount() === 0 || this.filterCount() === 4) {
      this.passengerDetails = this.selectedFlight.passengersDetail;
    } else if (this.filterCount() === 1) {
      if (options[0].label === 'Checked-in') {
        this.passengerDetails = this.selectedFlight.passengersDetail.filter(detail => detail.isCheckedIn);
      } else if (options[0].label === 'Pending check-in') {
        this.passengerDetails = this.selectedFlight.passengersDetail.filter(detail => !detail.isCheckedIn);
      } else if (options[0].label === 'Wheel-chair') {
        this.passengerDetails = this.selectedFlight.passengersDetail.filter(detail => detail.isWheelChairRequired);
      } else if (options[0].label === 'Infants') {
        this.passengerDetails = this.selectedFlight.passengersDetail.filter(detail => detail.hasInfant);
      }
    } else if (this.filterCount() === 2) {
      if (options[0].label === 'Checked-in' && options[1].label === 'Pending check-in') {
        this.passengerDetails = this.selectedFlight.passengersDetail;
      } else if (options[0].label === 'Checked-in' && options[1].label === 'Wheel-chair') {
        this.passengerDetails = this.selectedFlight.passengersDetail.filter(detail =>
          detail.isCheckedIn && detail.isWheelChairRequired);
      } else if (options[0].label === 'Checked-in' && options[1].label === 'Infants') {
        this.passengerDetails = this.selectedFlight.passengersDetail.filter(detail =>
          detail.isCheckedIn && detail.hasInfant);
      } else if (options[0].label === 'Pending check-in' && options[1].label === 'Wheel-chair') {
        this.passengerDetails = this.selectedFlight.passengersDetail.filter(detail =>
          !detail.isCheckedIn && detail.isWheelChairRequired);
      } else if (options[0].label === 'Pending check-in' && options[1].label === 'Infants') {
        this.passengerDetails = this.selectedFlight.passengersDetail.filter(detail =>
          !detail.isCheckedIn && detail.hasInfant);
      } else if (options[0].label === 'Wheel-chair' && options[1].label === 'Infants') {
        this.passengerDetails = this.selectedFlight.passengersDetail.filter(detail =>
          detail.isWheelChairRequired && detail.hasInfant);
      }
    } else if (this.filterCount() === 3) {
      if (options[0].label === 'Checked-in' && options[1].label === 'Pending check-in' && options[2].label === 'Wheel-chair') {
        this.passengerDetails = this.selectedFlight.passengersDetail.filter(detail => !detail.hasInfant && detail.isWheelChairRequired);
      } else if (options[0].label === 'Checked-in' && options[1].label === 'Wheel-chair' && options[2].label === 'Infants') {
        this.passengerDetails = this.selectedFlight.passengersDetail.filter(detail =>
          detail.isCheckedIn && detail.isWheelChairRequired && detail.hasInfant);
      } else if (options[0].label === 'Checked-in' && options[1].label === 'Pending check-in' && options[2].label === 'Infants') {
        this.passengerDetails = this.selectedFlight.passengersDetail.filter(detail => !detail.isWheelChairRequired && detail.hasInfant);
      } else if (options[0].label === 'Pending check-in' && options[1].label === 'Wheel-chair' && options[2].label === 'Infants') {
        this.passengerDetails = this.selectedFlight.passengersDetail.filter(detail =>
          !detail.isCheckedIn && detail.isWheelChairRequired && detail.hasInfant);
      }
    }
  }

}
