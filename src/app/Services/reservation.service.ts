import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Reservation } from '../models/reservation.model';

const baseUrl = 'http://localhost:8080/reservations';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(baseUrl);
  }

  get(id: any): Observable<Reservation> {
    return this.http.get(`${baseUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }

  accept(id: any): Observable<Reservation> {
    return this.http.put(`${baseUrl}/accept/${id}`, id);
  }

  refuse(id: any): Observable<Reservation> {
    return this.http.put(`${baseUrl}/refuse/${id}`, id);
  }

  cancel(id: any): Observable<Reservation> {
    return this.http.put(`${baseUrl}/cancel/${id}`, id);
  }

  checkin(id: any): Observable<Reservation> {
    return this.http.put(`${baseUrl}/checkin/${id}`, id);
  }

  checkout(id: any): Observable<Reservation> {
    return this.http.put(`${baseUrl}/checkout/${id}`, id);
  }


  getByStatus(status: any): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${baseUrl}/status/${status}`);
  }

  getByStatusAndUser(status: any, user: any): Observable<Reservation[]> {
    return this.http.post<Reservation[]>(`${baseUrl}/status-user/${status}`, user);
  }

  getByUserName(name: any): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${baseUrl}/user-name/${name}`);
  }

  getByUserId(id: any): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${baseUrl}/user/${id}`);
  }

  getByHost(id: any): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${baseUrl}/host/${id}`);
  }
}
