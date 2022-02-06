import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Reservation } from '../models/reservation.model';
import { Setting } from '../models/setting.model';
import { User } from '../models/user.model';
import { FeedbackService } from '../Services/feedback.service';
import { FileUploadService } from '../Services/file-upload.service';
import { ProvinceService } from '../Services/province.service';
import { ReservationService } from '../Services/reservation.service';
import { TokenStorageService } from '../Services/token-storage.service';
import { UserService } from '../Services/user.service';

@Component({
  selector: 'app-my-booking',
  templateUrl: './my-booking.component.html',
  styleUrls: ['./my-booking.component.scss']
})
export class MyBookingComponent implements OnInit {

  imgDefaultHomestay: string = "./assets/images/defaultHomestay.jpg";

  json: any;
  totalLength: any;
  page: number = 1;
  public currentUser: User = {};
  isLoggin = false;
  reservationList: Reservation[] = [];

  /* button cancel booking and send feedback */
  isDisappearBtnCancelBooking:boolean = false;
  isDisappearBtnFeedback: boolean = false;

  /* button send feedback */
  disabledBtnSendFeedback:boolean = true;

  /* Message question */
  messQuestion:string = '';
  messQuestionType:string = '';

  /* Toast message */
  displaySuccessMess:boolean = false;
  displayErrorMess:boolean = false;
  mess:string='';
  currency: any = new Intl.NumberFormat('en');
  fileInfos?: Observable<any>;
  currentReservation: Reservation = {};
  imgList = new Map();
  
  constructor(private token: TokenStorageService, private router: Router, private userService: UserService,
    private reservationService: ReservationService, private provinceService: ProvinceService,
    private feedbackService: FeedbackService, private uploadService: FileUploadService) { }

  ngOnInit(): void {
    document.body.scrollTop = 0;// For Safari
    document.documentElement.scrollTop = 0;// For Chrome, Firefox, IE and Opera
    if (this.token.getToken()) {
      this.isLoggin = true;
      this.getCurrentUser(this.token.getUser().username);
      this.getReservationsByUser(this.token.getUser().id);
    }
    if(!this.token.getToken()){
      this.router.navigate(['auth/login']);
    }
    this.uploadService.getFiles().subscribe(
      data => {
        this.fileInfos = data;
        this.fileInfos!.forEach(element => {
          this.imgList.set(element.name, element.url);
        });
      }
    );
  }

  getReservationByStatusAndUser(event: any): void {
    if(event.target.value == 0){
      this.getReservationsByUser(this.currentUser.id);
    }
    else{
      let status = event.target.value;
      this.reservationService.getByUserId(this.currentUser.id)
      .subscribe(
        data => {
          this.reservationList = [];
          data.forEach(reservation => {
            if(reservation.status == status){
              this.reservationList.push(reservation);
            }
          });
        },
        error => {
          this.reservationList = [];
        }
      );
    }
    
  }

  getCurrentUser(userName: string): void {
    this.userService.getByUsername(userName)
      .subscribe(
        data => {
          this.currentUser = data;
        },
        error => {
          console.log(error);
        }
      );
  }

  getReservationsByUser(id: any): void {
    this.reservationService.getByUserId(id)
      .subscribe(
        data => {
          this.reservationList = data;
        },
        error => {
          console.log(error);
        }
      );
  }

  setStatus(status: any): any {
    switch (status) {
      case 1: {
        return 'Đang chờ duyệt';
      }
      case 2: {
        return 'Đã được duyệt';
      }
      case 3: {
        return 'Đã checkin';
      }
      case 4: {
        return 'Đã checkout và thanh toán';
      }
      case 5: {
        return 'Đã hủy đơn';
      }
    }
  }

  navigateToHomestayDetail(destinationId: any, homestayId: any): void {
    this.provinceService.getByDestination(destinationId)
      .subscribe(
        data => {
          let navigationExtras: NavigationExtras = {
            queryParams: {
              currentProvinceId: data.id,
              currentDestinationId: destinationId,
              currentHomestayId: homestayId
            }
          }
          this.router.navigate(['homestay-detail'], navigationExtras);
        },
        error => {
          console.log(error);
        }
      );
  }

  showToastMessage(message:string, typeMess: string) {
    if(typeMess == 'success') {
      this.displaySuccessMess = true;
      this.mess = message;
      setTimeout(()=>{
        this.displaySuccessMess = false;
        window.location.reload();
        this.mess = '';
      },2000);
    }else if(typeMess == 'error') {
      this.displayErrorMess = true;
      this.mess = message;
      setTimeout(()=>{
        this.displayErrorMess = false;
        window.location.reload();
        this.mess = '';
      },2000);
    }
  }

  validWriteFeedback() {
    let feedback = (<HTMLTextAreaElement>document.getElementById('feedback')).value;
    if (feedback == null || feedback.length <= 0) {
      this.disabledBtnSendFeedback = true;
    } else {
      this.disabledBtnSendFeedback = false;
    }
  }


  cancelBooking(reservation: any): void {
    this.messQuestion = 'Bạn có chắc muốn huỷ đặt phòng này không ?';
    this.getCurrentReservation(reservation);
  }

  getCurrentReservation(reservation: any): void{
    this.currentReservation = reservation;
  }

  clickSendFeedback(reservation: Reservation) {
    let data = {
      user: this.currentUser,
      content: (<HTMLTextAreaElement>document.getElementById('feedback')).value,
      score: 5,
      homestay: reservation.homestay
    }
    this.feedbackService.create(data).subscribe(
      res => {
        this.showToastMessage('Gửi đánh giá thành công', 'success');
        this.isDisappearBtnFeedback = true;
      },
      error => {
        console.log(error);
      }
    );
    
  }

  clickYES() {
    this.reservationService.cancel(this.currentReservation.id).subscribe(
      res => {
        this.showToastMessage('Huỷ đặt phòng thành công', 'success');
        this.isDisappearBtnCancelBooking = true;
      },
      error => {
        this.showToastMessage('Huỷ đặt phòng thất bại!', 'error');
      }
    );
    
  }

}
