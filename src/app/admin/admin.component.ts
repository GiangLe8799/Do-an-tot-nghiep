import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { TokenStorageService } from '../Services/token-storage.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  currentUser: any = {};

  constructor(private token: TokenStorageService,private router: Router) { }

  ngOnInit(): void {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    if(this.token.getToken()){
      this.currentUser = this.token.getUser();
    }
    if(this.currentUser.roles[0] != 'ROLE_ADMIN'){
      this.router.navigate(['home']);
    }
    window.sessionStorage.removeItem("search-key");
  }

}
