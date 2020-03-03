import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material";
import { FlightState } from "../service/flight.state";
import { Store } from "@ngxs/store";
import { ActivatedRoute } from "@angular/router";
import { FlightService } from "../service/flight.service";

@Component({
  selector: "app-in-flight",
  templateUrl: "./in-flight.component.html",
  styleUrls: ["./in-flight.component.scss"]
})
export class InFlightComponent implements OnInit {
  id;
  selectedPassengerId;
  passengerDetails;
  status;
  selectedFlight;
  flightDetails;
  ancillary = [];
  vacantSeats = [];
  @ViewChild("changeSeatDialog", { static: false })
  changeSeatDialog: TemplateRef<any>;
  @ViewChild("changeStatusDialog", { static: false })
  changeStatusDialog: TemplateRef<any>;

  constructor(
    private flightService: FlightService,
    private store: Store,
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.flightDetails = this.store.selectSnapshot(FlightState.getFlights);
    console.log("1234", this.flightDetails);
    this.route.params.subscribe(params => {
      this.id = +params["flightId"]; // (+) converts string 'id' to a number
      console.log(this.id);
    });

    this.selectedFlight = this.flightDetails[this.id];
    this.passengerDetails = JSON.parse(
      JSON.stringify(this.selectedFlight.passengersDetail)
    );
    this.selectedFlight.passengersDetail.forEach(element => {
      this.ancillary.push(
        element.ancilliaryServices.toString().replace(/,/g, ", ")
      );
    });
    console.log(this.flightDetails);
    console.log(this.selectedFlight);
  }

  changeStatus(seat) {
    this.passengerDetails.forEach(element => {
      if (element.seatNumber === seat.number) {
        this.selectedPassengerId = element.id;
        this.status = element.isCheckedIn;
      }
    });
    const dialogRef = this.dialog.open(this.changeStatusDialog, {
      width: "300px"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result === "yes") {
          this.passengerDetails.forEach(element => {
            if (element.seatNumber === seat.number) {
              element.isCheckedIn = this.status;
            }
            this.flightService
              .updateAncilliaryServices(this.id, this.selectedFlight)
              .subscribe(response => {
                if (response) {
                  // this.adminService.statusCode.next('1');
                  // this.adminService.statusMessage.next('Suucessfully Added the Meal');
                } else {
                  // this.adminService.statusCode.next('0');
                  // this.adminService.statusMessage.next('Something went wrong');
                }
              });
          });
          console.log(this.selectedFlight.passengersDetail);
        }
      }
    });
  }

  showAncilliaryServices(serviceName, item): boolean {
    console.log(item);
    const index = this.selectedFlight.passengersDetail.findIndex(
      passenger => passenger.id === this.selectedPassengerId
    );
    if (index > -1) {
      return this.selectedFlight.passengersDetail[index][serviceName].indexOf(
        item
      ) > -1
        ? true
        : false;
    }
  }

  showMeals(serviceName, item): boolean {
    console.log(item);
    const index = this.selectedFlight.passengersDetail.findIndex(
      passenger => passenger.id === this.selectedPassengerId
    );
    if (index > -1) {
      return this.selectedFlight.passengersDetail[index][serviceName].indexOf(
        item
      ) > -1
        ? true
        : false;
    }
  }

  showShoppingItems(serviceName, item): boolean {
    console.log(item);
    const index = this.selectedFlight.passengersDetail.findIndex(
      passenger => passenger.id === this.selectedPassengerId
    );
    if (index > -1) {
      return this.selectedFlight.passengersDetail[index][serviceName].indexOf(
        item
      ) > -1
        ? true
        : false;
    }
  }
}
