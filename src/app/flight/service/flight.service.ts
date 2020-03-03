import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';
import { Observable } from 'rxjs';
import { Flight } from './flight.model';

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  constructor(private httpClient: HttpClient) { }

  BASE_URL = environment.apiUrl;

  getFlights(): Observable<Flight[]> {
    return this.httpClient.get<Flight[]>(`${this.BASE_URL}/flights`);
  }

  changeSeat(flightId, flightObj) {
    flightId += 1;
    return this.httpClient.put<any>(this.BASE_URL + '/flights/' + flightId, flightObj);
  }

  changeStatus(flightId, flightObj) {
    flightId += 1;
    return this.httpClient.put<any>(this.BASE_URL + '/flights/' + flightId, flightObj);
  }
}
