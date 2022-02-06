import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Reservation } from '../models/reservation.model';
import { FileUploadService } from '../Services/file-upload.service';
import { ReservationService } from '../Services/reservation.service';
import { TokenStorageService } from '../Services/token-storage.service';

@Component({
  selector: 'app-host-homestay-booking-detail',
  templateUrl: './host-homestay-booking-detail.component.html',
  styleUrls: ['./host-homestay-booking-detail.component.scss']
})
export class HostHomestayBookingDetailComponent implements OnInit {
  imgDefaultHomestay:string = "./assets/images/defaultHomestay.jpg";
  currency:any = new Intl.NumberFormat('en');
  retrieveParams: any = {
    currentReservationId: 0
  }
  numberOfBookedDays = 0;
  currentReservation: Reservation = {};
  fileInfos?: Observable<any>;

  constructor(private route: ActivatedRoute, private reservationService: ReservationService,
    private router: Router, private token: TokenStorageService, private uploadService: FileUploadService) { }

  ngOnInit(): void {
    document.body.scrollTop = 0;// For Safari
    document.documentElement.scrollTop = 0;// For Chrome, Firefox, IE and Opera
    (<HTMLInputElement>document.getElementById('fullname')).value = "Nguyen Van A";
    (<HTMLInputElement>document.getElementById('phone')).value = "091234567";
    (<HTMLInputElement>document.getElementById('email')).value = "Anv@gmail.com";
    this.route.queryParams.subscribe(params => {
      this.retrieveParams = params;
    });
    this.getReservationById(this.retrieveParams.currentReservationId);
  }


  getReservationById(reservationId: any): void{
    this.reservationService.get(reservationId).subscribe(
      data=>{
        this.currentReservation = data;
        this.numberOfBookedDays = this.getDays(this.currentReservation.startDate, this.currentReservation.endDate);
        this.uploadService.getFiles().subscribe(
          res => {
            this.fileInfos = res;
            this.fileInfos!.forEach(element => {
              if(element.name == 'homestay'+ this.currentReservation.homestay!.homestayName+'.jpg'){
                this.imgDefaultHomestay = element.url;
              }
            });
          }
        );
      },
      error=>{
        console.log(error);
      }
    );
  }

  getDays(startDate: any, endDate: any): any {
    var end = new Date(endDate);
    var start = new Date(startDate);
    var result = end.getTime() - start.getTime();

    return result / (1000 * 3600 * 24);
  }
}
