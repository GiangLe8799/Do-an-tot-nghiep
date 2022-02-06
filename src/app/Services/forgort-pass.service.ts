import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const baseUrl = 'http://localhost:8080/token';

@Injectable({
  providedIn: 'root'
})
export class ForgortPassService {

  constructor(private http: HttpClient) { }

  createToken(userId: any): Observable<any>{
    return this.http.post(`${baseUrl}/create`,userId);
  }

  findUserIdByToken(token: any): Observable<any>{
    return this.http.post(`${baseUrl}/user`, token);
  }
}
