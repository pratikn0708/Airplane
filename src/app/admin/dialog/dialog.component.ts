import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import { AdminServiceService } from '../admin-service.service';

export interface DialogData {
  flightId: number;
  event: any;
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  public services = [];
  public meals = [];
  public shoppingItems = [];
  public flightNumbers = [];
  public id;
  public title = 'Add the Passenger Details';
  public serviceDropdown = false;
  public mealsDropdown = false;
  public shoppingItemsDropdown = false;
  private flightId: number;


  CreatePassenger = new FormGroup({
    name: new FormControl(),
    seatNumber: new FormControl(),
    ancilliaryServices: new FormControl(),
    passportNumber: new FormControl(),
    address: new FormControl(),
    dateOfBirth: new FormControl(''),
    isCheckedIn: new FormControl(),
    hasInfant: new FormControl(),
    isWheelChairRequired: new FormControl(),
    meals: new FormControl(),
    shoppingItems: new FormControl(),
  });

  public displayDetails: any;
  public flightsData: any[];

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    public adminService: AdminServiceService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {

    this.flightId = data.flightId;
    if (data.event == null) {
      this.title = 'Add the Passenger Details';
      this.CreatePassenger.reset();
    } else {
      this.title = 'Update the Passenger Details';
      data.event.dateOfBirth = new Date(data.event.dateOfBirth);
      if (data.event.hasInfant === true) {
        data.event.hasInfant = 'yes';
      } else if (data.event.hasInfant === false) {
        data.event.hasInfant = 'no';
      }

      if (data.event.isCheckedIn === true) {
        data.event.isCheckedIn = 'yes';
      } else if (data.event.isCheckedIn === false) {
        data.event.isCheckedIn = 'no';
      }

      if (data.event.isWheelChairRequired === true) {
        data.event.isWheelChairRequired = 'yes';
      } else if (data.event.isWheelChairRequired === false) {
        data.event.isWheelChairRequired = 'no';
      }
      this.CreatePassenger.reset(data.event);
      this.id = data.event.id;
    }
    this.adminService.getpassengersDetails().subscribe(res => {
      this.flightsData = res;
      this.services = this.flightsData[this.flightId].ancilliaryServices;
      this.meals = this.flightsData[this.flightId].meals;
      this.shoppingItems = this.flightsData[this.flightId].shoppingItems;
    }, error => {
      console.log(error);
    });
  }

  ngOnInit() {
  }

  public onsubmit() {
    const data = this.CreatePassenger.value;
    if (this.id === undefined) {
      const flightdata = this.flightsData[this.flightId];
      const personid = flightdata.passengersDetail.length;
      data.id = personid + 1;
      flightdata.passengersDetail.push(data);

      this.adminService.addPassenger(flightdata, this.flightId + 1).subscribe(res => {
        if (res) {
          this.adminService.statusCode.next('1');
          this.adminService.statusMessage.next('Suucessfully Added the Passenger');
          this.onNoClick();
        } else {
          this.adminService.statusCode.next('0');
          this.adminService.statusMessage.next('Something went wrong');
        }
      });
    } else {
      const updatedData = this.CreatePassenger.value;
      const flightData = this.flightsData[this.flightId];

      flightData.passengersDetail[this.id - 1] = updatedData;
      flightData.passengersDetail[this.id - 1].id = this.id;

      this.adminService.updatePassenger(this.flightId, flightData).subscribe(response => {
        if (response) {
          this.adminService.statusCode.next('1');
          this.adminService.statusMessage.next('Suucessfully Updated the Passenger');
          this.onNoClick();
        } else {
          this.adminService.statusCode.next('0');
          this.adminService.statusMessage.next('Something went wrong');
        }
      });
    }
  }
  public clear() {
    this.CreatePassenger.reset();
  }
  public onNoClick() {
    this.dialogRef.close();
  }

}
