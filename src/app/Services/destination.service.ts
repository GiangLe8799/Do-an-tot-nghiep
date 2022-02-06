import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Destination } from '../models/destination.model';

const baseUrl = 'http://localhost:8080/destinations';

@Injectable({
  providedIn: 'root'
})
export class DestinationService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Destination[]>{
    return this.http.get<Destination[]>(baseUrl);
  }

  getByProvince(provinceid: any): Observable<Destination[]>{
    return this.http.get<Destination[]>(`${baseUrl}/province/${provinceid}`);
  }

  getByDistrict(districtid: any): Observable<Destination[]>{
    return this.http.get<Destination[]>(`${baseUrl}/district/${districtid}`);
  }

  getByName(name: any, type: string, id: any): Observable<Destination[]>{
    return this.http.get<Destination[]>(`${baseUrl}/search/${name}/${type}/${id}`);
  }
  
  get(id: any): Observable<Destination>{
    return this.http.get(`${baseUrl}/${id}`);
  }

  countByProvinceId(id: any): Observable<any>{
    return this.http.get(`${baseUrl}/count/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }

  update(data: any): Observable<any> {
    return this.http.put(baseUrl, data);
  }

  changeStatus(status:number, id: any): Observable<any> {
    return this.http.put(`${baseUrl}/status/${status}`, id);
  }
}
