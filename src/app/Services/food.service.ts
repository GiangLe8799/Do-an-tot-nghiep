import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Food } from '../models/food.model';

const baseUrl = 'http://localhost:8080/foods';

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  constructor(private http: HttpClient) { }

  get(id: any): Observable<Food>{
    return this.http.get(`${baseUrl}/${id}`);
  }
  
  getByProvince(provinceId: any): Observable<Food[]>{
    return this.http.get<Food[]>(`${baseUrl}/province/${provinceId}`);
  }

  getByName(name: any, provinceId: any): Observable<Food[]>{
    return this.http.get<Food[]>(`${baseUrl}/search/${name}/${provinceId}`);
  }

  getAll(): Observable<Food[]>{
    return this.http.get<Food[]>(baseUrl);
  }

  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }

  update(data: any): Observable<any> {
    return this.http.put(baseUrl, data);
  }

  setStatus(id: any, status: any): Observable<any> {
    return this.http.put(`${baseUrl}/status/${status}`, id);
  }
}
