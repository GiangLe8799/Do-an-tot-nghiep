import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Homestay } from '../models/homestay.model';

const baseUrl = 'http://localhost:8080/homestays';

@Injectable({
  providedIn: 'root'
})
export class HomestayService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Homestay[]>{
    return this.http.get<Homestay[]>(baseUrl);
  }

  get(id: any): Observable<Homestay>{
    return this.http.get(`${baseUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }

  update(data: any): Observable<any> {
    return this.http.put(baseUrl, data);
  }

  getByName(name: any): Observable<Homestay[]>{
    return this.http.get<Homestay[]>(`${baseUrl}/searchname/${name}`);
  }

  getByNameAndTypeAndHost(name: any): Observable<Homestay[]>{
    return this.http.get<Homestay[]>(`${baseUrl}/searchname/${name}`);
  }

  getByType(placeiId:any, typeName: string): Observable<Homestay[]>{
    return this.http.get<Homestay[]>(`${baseUrl}/type/${placeiId}/${typeName}`);
  }

  getByUser(userId: any, typeName: string, searchKey: string): Observable<Homestay[]>{
    return this.http.get<Homestay[]>(`${baseUrl}/user/${userId}/${typeName}/${searchKey}`);
  }

  getByDestination(destinationId: any, typeName: string): Observable<Homestay[]>{
    return this.http.get<Homestay[]>(`${baseUrl}/destination/${destinationId}/${typeName}`);
  }

  getTopByDestination(destinationId: any): Observable<Homestay[]>{
    return this.http.get<Homestay[]>(`${baseUrl}/top5bydestination/${destinationId}`);
  }

  getByPlace(placeId: any): Observable<Homestay[]>{
    return this.http.get<Homestay[]>(`${baseUrl}/place/${placeId}`);
  }

  countByProvinceId(id: any): Observable<any>{
    return this.http.get(`${baseUrl}/count/${id}`);
  }

  topHomestays(): Observable<Homestay[]>{
    return this.http.get<Homestay[]>(`${baseUrl}/top5hot`);
  }
  
  searchHomestays(dateList: any, provinceId: any): Observable<Homestay[]>{
    return this.http.post<Homestay[]>(`${baseUrl}/search/${provinceId}`, dateList);
  }
  searchHomestaysByDestination(dateList: any, destinationId: any): Observable<Homestay[]>{
    return this.http.post<Homestay[]>(`${baseUrl}/searchByDestination/${destinationId}`, dateList);
  }
  checkHomestayAcceptable(dateList: any, homestayId: any): Observable<Homestay>{
    return this.http.post<Homestay>(`${baseUrl}/checkacceptable/${homestayId}`, dateList);
  }
  changeStatus(status:number, id: any): Observable<any> {
    return this.http.put(`${baseUrl}/status/${status}`, id);
  }
}
