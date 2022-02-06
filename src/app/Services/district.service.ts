import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { District } from '../models/district.model';

const baseUrl = 'http://localhost:8080/districts';

@Injectable({
  providedIn: 'root'
})
export class DistrictService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<District[]>{
    return this.http.get<District[]>(baseUrl);
  }

  getByProvince(provinceid: any): Observable<District[]>{
    return this.http.get<District[]>(`${baseUrl}/province/${provinceid}`);
  }

  get(id: any): Observable<District>{
    return this.http.get(`${baseUrl}/${id}`);
  }
}
