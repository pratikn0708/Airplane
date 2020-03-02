import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {

  constructor(private http: HttpClient) { }

  api = 'http://localhost:3000/';

  statusMessage = new BehaviorSubject('');
  statusCode = new BehaviorSubject('');
  updatePassengerData = new BehaviorSubject(null);
  currentPassengerData = this.updatePassengerData.asObservable();
  updateServicesData = new BehaviorSubject(null);
  currentServiceData = this.updateServicesData.asObservable();
  updateFlightData = new BehaviorSubject(null);
  currentFlightData = this.updateFlightData.asObservable();
  isLoggedIn = false;

  public getpassengersDetails() {
    return this.http.get<any[]>(this.api + 'flights');
  }

  public editedPassengerData(data) {
    this.updatePassengerData.next(data);
  }

  public editedServicesData(data) {
    this.updateServicesData.next(data);
  }

  public editedFlightData(data) {
    this.updateFlightData.next(data);
  }

  public getStatusMessage() {
    return this.statusMessage.asObservable();
  }

  public getStatusCode() {
    return this.statusCode.asObservable();
  }

  public getFlightDetails() {
    return this.http.get<any[]>(this.api + 'flights');
  }

  public updateFlight(flightId, flightObj) {
    return this.http.put<any>(this.api + 'flights/' + flightId, flightObj);
  }

  public addPassenger(passengerObj, flightId) {
    return this.http.put(this.api + `flights/${flightId}`, passengerObj);
  }

  public updatePassenger(flightId, passengerObj) {
    flightId += 1;
    return this.http.put<any[]>(this.api + `flights/${flightId}`, passengerObj);
  }

  public loadServices() {
    return this.http.get<any[]>(this.api + 'ancilliaryServices');
  }

  public editServices(flightId, passengerObj) {
    flightId += 1;
    return this.http.put<any[]>(this.api + `flights/${flightId}`, passengerObj);
  }

  public deleteServices(id) {
    return this.http.delete<any>(this.api + 'ancilleryServices/' + id);
  }

  public addServices(services) {
    return this.http.post(this.api + 'ancilleryServices', services);
  }

  public selectedFlightServices(no) {
    return this.http.get<any>(this.api + 'flights/' + no);
  }

  public setLoggedIn(toggle: boolean) {
    this.isLoggedIn = toggle;
  }

}
