import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authStatusListener = '';

  constructor(private http: HttpClient) { }

  public signIn(): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrl}/login`
    );
  }

  public fetchAuthStatusListener() {
    return this.authStatusListener;
  }

  public setAuthStatusListener(flag) {
    this.authStatusListener = flag;
  }



}
