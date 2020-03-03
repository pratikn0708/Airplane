import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { AdminServiceService } from '../admin-service.service';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';


@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.component.html',
  styleUrls: ['./home-admin.component.scss']
})
export class HomeAdminComponent implements OnInit, OnDestroy {
  public displayedColumns: string[] = ['addedService', 'action'];
  public mealDisplayedColumns: string[] = ['addedMeal', 'action'];
  public shoppingItemDisplayedColumns: string[] = ['addedShoppingItem', 'action'];
  public displayedColumns2: string[] = ['passengerName', 'passportNumber', 'address', 'action'];
  public displayesColumns3: string[] = ['flightnumber', 'flightname', 'ancillaryservices', 'specialMeals', 'action'];

  public allPassengersDetails: any[];
  public dataSource: any;
  public allFlightDetails: any[];
  public ancillaryservicesList: string[];
  public addPassengerDetails: any[];
  public statusMessage: string;
  public statusCode: string;
  public services;
  public meals;
  public shoppingItems;
  private routeSub: Subscription;
  private flightId: number;

  ancillaryService = '';
  meal = '';
  shoppingItem = '';
  @ViewChild('ancillaryServiceDialog', { static: false }) ancillaryServiceDialog: TemplateRef<any>;
  @ViewChild('mealDialog', { static: false }) mealDialog: TemplateRef<any>;
  @ViewChild('shoppingItemDialog', { static: false }) shoppingItemDialog: TemplateRef<any>;
  constructor(
    private adminService: AdminServiceService,
    private route: Router,
    private router: ActivatedRoute,
    private dialog: MatDialog) {
    this.routeSub = this.router.params.subscribe(params => {
      this.flightId = +params.id;
    });
    this.adminService.getStatusMessage().subscribe(res => {
      this.statusMessage = res;
      if (this.statusCode === '1') {
        this.fetchPassengers();
        this.fetchallServices();
        this.fetchallFlights();
        this.fetchallMeals();
        this.fetchallShoppingItems();
      }
    });
    this.adminService.getStatusCode().subscribe(res => {
      this.statusCode = res;
    });
  }

  ngOnInit() {
    this.fetchPassengers();
    this.fetchallServices();
    this.fetchallFlights();
    this.fetchallMeals();
    this.fetchallShoppingItems();
  }

  public fetchPassengers() {
    this.adminService.getpassengersDetails().subscribe(res => {
      this.allPassengersDetails = res[this.flightId].passengersDetail;

      this.dataSource = new MatTableDataSource(this.allPassengersDetails);
    }, error => {
      console.log(error);
    });
  }

  public fetchallServices() {
    this.adminService.getpassengersDetails().subscribe(res => {
      this.meals = res[this.flightId].meals;
    }, error => {
      console.log(error);
    });
  }

  public fetchallMeals() {
    this.adminService.getpassengersDetails().subscribe(res => {
      this.services = res[this.flightId].ancilliaryServices;
    }, error => {
      console.log(error);
    });
  }

  public fetchallShoppingItems() {
    this.adminService.getpassengersDetails().subscribe(res => {
      this.shoppingItems = res[this.flightId].shoppingItems;
    }, error => {
      console.log(error);
    });
  }

  public fetchallFlights() {
    this.adminService.getFlightDetails().subscribe(res => {
      this.allFlightDetails = res;
    }, error => {
      console.log(error);
    });
  }

  public updatePassengers(event) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        event,
        flightId: this.flightId
      }
    });
    dialogRef.afterClosed().subscribe();
  }

  public onAddPassenger() {
    this.adminService.editedPassengerData(null);
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        event: null,
        flightId: this.flightId
      }
    });
    dialogRef.afterClosed().subscribe();
  }

  public updateAncillaryServices(event) {
    this.ancillaryService = event;
    const flightData = this.allFlightDetails[this.flightId];

    const dialogRef = this.dialog.open(this.ancillaryServiceDialog, { width: '300px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined && result !== 'no') {
        const index = flightData.ancilliaryServices.indexOf(event);
        flightData.ancilliaryServices = flightData.ancilliaryServices.filter(
          item => item !== event.toString());
        flightData.ancilliaryServices.splice(index, 0, result);
        this.adminService.editServices(this.flightId, flightData).subscribe(response => {
          if (response) {
            this.adminService.statusCode.next('1');
            this.adminService.statusMessage.next('Suucessfully Updated the AncillaryServices');
          } else {
            this.adminService.statusCode.next('0');
            this.adminService.statusMessage.next('Something went wrong');
          }
        });
      }
    });
    dialogRef.afterClosed().subscribe();
  }

  public onAddServices() {
    const flightData = this.allFlightDetails[this.flightId];

    const dialogRef = this.dialog.open(this.ancillaryServiceDialog, { width: '300px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined && result !== 'no') {
        flightData.ancilliaryServices.push(result);
        this.adminService.editServices(this.flightId, flightData).subscribe(response => {
          if (response) {
            this.adminService.statusCode.next('1');
            this.adminService.statusMessage.next('Suucessfully Added the AncillaryServices');
          } else {
            this.adminService.statusCode.next('0');
            this.adminService.statusMessage.next('Something went wrong');
          }
        });
      }
    });
    this.ancillaryService = '';
    dialogRef.afterClosed().subscribe();
  }

  public deleteAncillaryServices(event) {
    const flightData = this.allFlightDetails[this.flightId];
    flightData.ancilliaryServices = flightData.ancilliaryServices.filter(
      item => item !== event.toString());
    this.adminService.editServices(this.flightId, flightData).subscribe(response => {
      if (response) {
        this.adminService.statusCode.next('1');
        this.adminService.statusMessage.next('Suucessfully Deleted the AncillaryServices');
      } else {
        this.adminService.statusCode.next('0');
        this.adminService.statusMessage.next('Something went wrong');
      }
    });
  }

  public updateMeal(event) {
    this.meal = event;
    const flightData = this.allFlightDetails[this.flightId];

    const dialogRef = this.dialog.open(this.mealDialog, { width: '300px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined && result !== 'no') {
        const index = flightData.meals.indexOf(event);
        flightData.meals = flightData.meals.filter(
          item => item !== event.toString());
        flightData.meals.splice(index, 0, result);
        this.adminService.editMeals(this.flightId, flightData).subscribe(response => {
          if (response) {
            this.adminService.statusCode.next('1');
            this.adminService.statusMessage.next('Suucessfully Updated the Meal');
          } else {
            this.adminService.statusCode.next('0');
            this.adminService.statusMessage.next('Something went wrong');
          }
        });
      }
    });
    dialogRef.afterClosed().subscribe();
  }

  public onAddMeals() {
    const flightData = this.allFlightDetails[this.flightId];

    const dialogRef = this.dialog.open(this.mealDialog, { width: '300px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined && result !== 'no') {
        flightData.meals.push(result);
        this.adminService.editMeals(this.flightId, flightData).subscribe(response => {
          if (response) {
            this.adminService.statusCode.next('1');
            this.adminService.statusMessage.next('Suucessfully Added the Meal');
          } else {
            this.adminService.statusCode.next('0');
            this.adminService.statusMessage.next('Something went wrong');
          }
        });
      }
    });
    this.meal = '';
    dialogRef.afterClosed().subscribe();
  }

  public deleteMeal(event) {
    const flightData = this.allFlightDetails[this.flightId];
    flightData.meals = flightData.meals.filter(
      item => item !== event.toString());
    this.adminService.editMeals(this.flightId, flightData).subscribe(response => {
      if (response) {
        this.adminService.statusCode.next('1');
        this.adminService.statusMessage.next('Suucessfully Deleted the Meal');
      } else {
        this.adminService.statusCode.next('0');
        this.adminService.statusMessage.next('Something went wrong');
      }
    });
  }

  public updateShoppingItem(event) {
    this.shoppingItem = event;
    const flightData = this.allFlightDetails[this.flightId];

    const dialogRef = this.dialog.open(this.shoppingItemDialog, { width: '300px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined && result !== 'no') {
        const index = flightData.shoppingItems.indexOf(event);
        flightData.shoppingItems = flightData.shoppingItems.filter(
          item => item !== event.toString());
        flightData.shoppingItems.splice(index, 0, result);
        this.adminService.editShoppingItems(this.flightId, flightData).subscribe(response => {
          if (response) {
            this.adminService.statusCode.next('1');
            this.adminService.statusMessage.next('Suucessfully Updated the Shopping Items');
          } else {
            this.adminService.statusCode.next('0');
            this.adminService.statusMessage.next('Something went wrong');
          }
        });
      }
    });
    dialogRef.afterClosed().subscribe();
  }

  public onAddShoppingItem() {
    const flightData = this.allFlightDetails[this.flightId];

    const dialogRef = this.dialog.open(this.shoppingItemDialog, { width: '300px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined && result !== 'no') {
        flightData.shoppingItems.push(result);
        this.adminService.editShoppingItems(this.flightId, flightData).subscribe(response => {
          if (response) {
            this.adminService.statusCode.next('1');
            this.adminService.statusMessage.next('Suucessfully Added the Shopping Items');
          } else {
            this.adminService.statusCode.next('0');
            this.adminService.statusMessage.next('Something went wrong');
          }
        });
      }
    });
    this.shoppingItem = '';
    dialogRef.afterClosed().subscribe();
  }

  public deleteShoppingItem(event) {
    const flightData = this.allFlightDetails[this.flightId];
    flightData.shoppingItems = flightData.shoppingItems.filter(
      item => item !== event.toString());
    this.adminService.editShoppingItems(this.flightId, flightData).subscribe(response => {
      if (response) {
        this.adminService.statusCode.next('1');
        this.adminService.statusMessage.next('Suucessfully Deleted the Shopping Item');
      } else {
        this.adminService.statusCode.next('0');
        this.adminService.statusMessage.next('Something went wrong');
      }
    });
  }

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

}
