import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Province } from '../models/province.model';

const baseUrl = 'http://localhost:8080/provinces';

@Injectable({
  providedIn: 'root'
})
export class ProvinceService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Province[]>{
    return this.http.get<Province[]>(baseUrl);
  }

  getTop(): Observable<Province[]>{
    return this.http.get<Province[]>(`${baseUrl}/top5`);
  }

  get(id: any): Observable<Province>{
    return this.http.get(`${baseUrl}/${id}`);
  }

  getByName(name: string): Observable<Province>{
    return this.http.get(`${baseUrl}/search/${name}`);
  }

  getByDestination(destinationId: any): Observable<Province>{
    return this.http.get(`${baseUrl}/destination/${destinationId}`);
  }
}
