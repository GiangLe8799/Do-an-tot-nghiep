import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Blog } from '../models/blog.model';

const baseUrl = 'http://localhost:8080/posts';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Blog[]>{
    return this.http.get<Blog[]>(baseUrl);
  }

  get(id: any): Observable<Blog>{
    return this.http.get(`${baseUrl}/${id}`);
  }

  getAllByDestination(id: any): Observable<Blog[]>{
    return this.http.get<Blog[]>(`${baseUrl}/destination/${id}`);
  }

  getTopByCategoryAndDate(category: string): Observable<Blog[]>{
    return this.http.get<Blog[]>(`${baseUrl}/top5ByCategory/${category}`);
  }

  getTopByProvince(provinceId: any): Observable<Blog[]>{
    return this.http.get<Blog[]>(`${baseUrl}/top5ByProvince/${provinceId}`);
  }

  getTopByDestination(destinationId: any): Observable<Blog[]>{
    return this.http.get<Blog[]>(`${baseUrl}/top5ByProvince/${destinationId}`);
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

  getByNameAndCategory(name: any, category: string): Observable<Blog[]>{
    return this.http.get<Blog[]>(`${baseUrl}/search/${name}/${category}`);
  }
}
