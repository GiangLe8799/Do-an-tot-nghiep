import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

const baseUrl = 'http://localhost:8080/users';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<User[]>{
    return this.http.get<User[]>(baseUrl);
  }

  get(id: any): Observable<User>{
    return this.http.get(`${baseUrl}/${id}`);
  }

  getByUsername(uname: string): Observable<User>{
    return this.http.get(`${baseUrl}/username/${uname}`);
  }
  
  getByRole(role: string): Observable<User[]>{
    return this.http.get<User[]>(`${baseUrl}/role/${role}`);
  }

  getByInfo(str: string, role: string): Observable<User[]>{
    return this.http.get<User[]>(`${baseUrl}/info/${str}/${role}`);
  }

  updateUser(data: any): Observable<User>{
    return this.http.put(baseUrl,data);
  }

  // findUserByPhone(phone: string): Observable<User>{
  //   return this.http.get(`${baseUrl}/phone/${phone}`);
  // }

  findUserByEmail(email: string): Observable<User>{
    return this.http.post(`${baseUrl}/email`, email);
  }

  updatePass(userId: any, newPass: any): Observable<User>{
    return this.http.put(`${baseUrl}/updatepass/${userId}`,newPass);
  }
  isCorrectPass(userId: any, pass: any): Observable<User>{
    return this.http.post(`${baseUrl}/iscorrectpass/${userId}`,pass);
  }

  changeStatusUser(data: any, status: any): Observable<any>{
    return this.http.put(`${baseUrl}/changestatus/${status}`,data);
  }

  changeRoleUser(data: any, role:string): Observable<any>{
    return this.http.put(`${baseUrl}/changerole/${role}`,data); 
  }
}
