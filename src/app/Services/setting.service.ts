import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Setting } from '../models/setting.model';

const baseUrl = 'http://localhost:8080/settings';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Setting[]> {
    return this.http.get<Setting[]>(baseUrl);
  }

  get(id: any): Observable<Setting> {
    return this.http.get(`${baseUrl}/${id}`);
  }

  getByType(type: any): Observable<Setting[]> {
    return this.http.get<Setting[]>(`${baseUrl}/type/${type}`);
  }

  getAllTypeSetting(): Observable<string[]> {
    return this.http.get<string[]>(`${baseUrl}/typelist`);
  }

  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }

  update(data: any): Observable<any> {
    return this.http.put(baseUrl, data);
  }
}
