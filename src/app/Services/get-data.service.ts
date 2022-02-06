import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GetDataService {

  constructor(private _http: HttpClient) { }

  listAllBlog(){
    return this._http.get("http://localhost:3000/blog-list");
  }

  listAllBlogBusiness(){
    return this._http.get("http://localhost:3000/homestay-business");
  }
}
