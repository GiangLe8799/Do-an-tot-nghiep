import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:8080/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(userName: string, passWord: string): Observable<any> {
    return this.http.post(AUTH_API + 'signin', {
      userName,
      passWord
    }, httpOptions);
  }

  register(data: any): Observable<any> {
    return this.http.post(AUTH_API + 'signup', data, httpOptions);
  }
}
