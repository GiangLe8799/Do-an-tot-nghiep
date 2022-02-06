import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Reservation } from '../models/reservation.model';
import { User } from '../models/user.model';
import { ReservationService } from '../Services/reservation.service';
import { TokenStorageService } from '../Services/token-storage.service';
import { UserService } from '../Services/user.service';

@Component({
  selector: 'app-host',
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.scss']
})
export class HostComponent implements OnInit {

  currentUser: any = {};
  reservationListLength: number = 0;

  constructor(private reservationService: ReservationService, private route: ActivatedRoute, private router: Router,
     private token: TokenStorageService, private userService: UserService) { }

  ngOnInit(): void {
    document.body.scrollTop = 0;// For Safari
    document.documentElement.scrollTop = 0;// For Chrome, Firefox, IE and Opera
    if(this.token.getToken()){
      this.currentUser = this.token.getUser();
      this.getReservationList();
    }
    if(this.currentUser.roles[0] != 'ROLE_HOST'){
      this.router.navigate(['home']);
    }
  }

  getReservationList(): void {
    this.reservationService.getByHost(this.currentUser.id).subscribe(
      data => {
        this.reservationListLength = data.length;
      },
      error => {
        console.log(error);
      }
    );
  }

}
