import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryService } from '../models/category-service.model';

const baseUrl = 'http://localhost:8080/services';

@Injectable({
  providedIn: 'root'
})
export class CategoryServiceService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<CategoryService[]>{
    return this.http.get<CategoryService[]>(baseUrl);
  }

  get(id: any): Observable<CategoryService>{
    return this.http.get(`${baseUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }

  update(data: any): Observable<any> {
    return this.http.put(baseUrl, data);
  }
}
