import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Feedback } from '../models/feedback.model';

const baseUrl = 'http://localhost:8080/feedbacks';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http: HttpClient) { }

  get(id: any): Observable<Feedback>{
    return this.http.get(`${baseUrl}/${id}`);
  }

  getAll(): Observable<Feedback[]>{
    return this.http.get<Feedback[]>(baseUrl);
  }

  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }

  update(data: any): Observable<any> {
    return this.http.put(baseUrl, data);
  }

  getByHomestay(id: any): Observable<Feedback[]>{
    return this.http.get<Feedback[]>(`${baseUrl}/homestay/${id}`);
  }
}
