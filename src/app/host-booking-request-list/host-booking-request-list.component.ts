import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Homestay } from '../models/homestay.model';
import { Reservation } from '../models/reservation.model';
import { User } from '../models/user.model';
import { HomestayService } from '../Services/homestay.service';
import { ReservationService } from '../Services/reservation.service';
import { TokenStorageService } from '../Services/token-storage.service';
import { UserService } from '../Services/user.service';

@Component({
  selector: 'app-host-booking-request-list',
  templateUrl: './host-booking-request-list.component.html',
  styleUrls: ['./host-booking-request-list.component.scss']
})
export class HostBookingRequestListComponent implements OnInit {

  totalPage: any;
  page: number = 1;
  search: string = '';
  messErrorSearch: string = '';
  isSortNO: boolean = true;
  isSortNameCustomer: boolean = true;
  isSortNameHomestay: boolean = true;
  isSortPrice: boolean = true;

  /* HTML */
  typeShow: number = 1;

  /* end */

  reservationList: Reservation[] = [];
  currentReservaition: Reservation = {};
  currentReservationId = 0;
  homestayList: Homestay[] = [];
  currentUser: User = {};
  reservationsNumber = 0;
  requestNumber = 0;
  checkinNumber = 0;
  checkoutNumber = 0;
  cancelNumber = 0;
  doneNumber = 0;
  currency: any = new Intl.NumberFormat('en');

  isNotBookingRequest: boolean = false;

  /* Message question */
  messQuestion: string = '';
  messQuestionType: string = '';

  /* Toast message */
  displaySuccessMess: boolean = false;
  displayErrorMess: boolean = false;
  mess: string = '';

  constructor(private reservationService: ReservationService, private route: ActivatedRoute, private router: Router,
    private homestayService: HomestayService, private token: TokenStorageService, private userService: UserService) { }

  ngOnInit(): void {
    if (this.token.getToken()) {
      this.getCurrentUser();
    }
  }

  getCurrentUser(): void {
    this.userService.getByUsername(this.token.getUser().username).subscribe(
      res => {
        this.currentUser = res;
        this.getReservationList();
      },
      error => { console.log(error); }
    );
  }

  countReservationByStatus(list: Reservation[], sta: any): number {
    let count = 0;
    list.forEach(element => {
      if (element.status == sta) {
        count += 1;
      }
    });
    return count;
  }

  getReservationList(): void {
    this.reservationService.getByHost(this.currentUser.id).subscribe(
      data => {
        this.reservationList = data;
        this.reservationsNumber = this.reservationList.length;
        this.requestNumber = this.countReservationByStatus(data, 1);
        this.checkinNumber = this.countReservationByStatus(data, 2);
        this.checkoutNumber = this.countReservationByStatus(data, 3);
        this.doneNumber = this.countReservationByStatus(data, 4);
        this.cancelNumber = this.countReservationByStatus(data, 5);
        this.reservationList.forEach((reservation) => {
          this.checkIsAcceptable(reservation.id);
        });
      },
      error => {
        console.log(error);
      }
    );
  }

  showAll(): void{
    this.typeShow = 7;
    this.reservationService.getByHost(this.currentUser.id).subscribe(
      data => {
        this.reservationList = data;
        this.reservationsNumber = this.reservationList.length;
      },
      error => {
        console.log(error);
      }
    );
  }

  navigateBookingDetail(reservationId: any): void {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        currentReservationId: reservationId
      }
    }
    this.router.navigate(['host/booking-request/detail'], navigationExtras);
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
        return 'Đã thanh toán và checkout';
      }
      case 5: {
        return 'Đã hủy đơn';
      }
    }
  }

  showToastMessage(message: string, typeMess: string) {
    if (typeMess == 'success') {
      this.displaySuccessMess = true;
      this.mess = message;
      setTimeout(() => {
        this.displaySuccessMess = false;
        window.location.reload();
        this.mess = '';
      }, 2000);
    } else if (typeMess == 'error') {
      this.displayErrorMess = true;
      this.mess = message;
      setTimeout(() => {
        this.displayErrorMess = false;
        window.location.reload();
        this.mess = '';
      }, 4000);
    }
  }

  showRequestBookingList() {
    this.reservationService.getByStatusAndUser(1, this.currentUser).subscribe(
      res => {
        this.reservationList = res;
      },
      error => { console.log(error); this.reservationList = [];}
    );
    this.typeShow = 1;
  }

  showCheckInList() {
    this.reservationService.getByStatusAndUser(2, this.currentUser).subscribe(
      res => {
        this.reservationList = res;
      },
      error => { console.log(error); this.reservationList = [];}
    );
    this.typeShow = 3;
  }

  showCheckOutList() {
    this.reservationService.getByStatusAndUser(3, this.currentUser).subscribe(
      res => {
        this.reservationList = res;
      },
      error => { console.log(error); this.reservationList = []; }
    );
    this.typeShow = 4;
  }

  showListCancelBookings() {
    this.reservationService.getByStatusAndUser(5, this.currentUser).subscribe(
      res => {
        this.reservationList = res;
      },
      error => {
        console.log(error);
        this.reservationList = [];
      }
    );
    this.typeShow = 2;
  }

  showListBooked() {
    this.reservationService.getByStatusAndUser(4, this.currentUser).subscribe(
      res => {
        this.reservationList = res;
      },
      error => {
        console.log(error);
        this.reservationList = [];
      }
    );
    this.typeShow = 5;
  }

  searchHomestay() {
    this.search = (<HTMLInputElement>document.getElementById('search')).value;
    if (this.validSearch(this.search)) {
      this.reservationService.getByUserName(this.search).subscribe(
        res => {
          this.reservationList = res;
          this.messErrorSearch = '';
        },
        error => {
          console.log(error);
          this.messErrorSearch = 'Không có đơn đặt của khách hàng '+this.search;
        }
      );

    }
  }

  private validSearch(search: string) {
    let isValid = false;
    if (search == null || search.length == 0) {
      this.messErrorSearch = '*Không được để trống';
      isValid = false;
    } else {
      this.messErrorSearch = '';
      isValid = true;
    }
    return isValid;
  }

  checkIsAcceptable(reservationId: any): void {
    var currentDate = new Date();
    var formatCurrentDate = formatDate(currentDate, 'yyyy-MM-dd', 'en-US');
    this.reservationService.get(reservationId).subscribe(
      res => {
        this.currentReservaition = res;
        if (this.currentReservaition.startDate! < formatCurrentDate && this.currentReservaition.status == 1) {
          this.reservationService.cancel(this.currentReservaition.id).subscribe();
        }
        if (this.currentReservaition.endDate! < formatCurrentDate && this.currentReservaition.status! < 3) {
          this.reservationService.cancel(this.currentReservaition.id).subscribe();
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  isCheckInValid(reservation: Reservation): boolean {
    var currentDate = new Date();
    var formatCurrentDate = formatDate(currentDate, 'yyyy-MM-dd', 'en-US');
    if (reservation.startDate! != formatCurrentDate) {
      return false;
    }
    return true;
  }

  isCheckoutValid(reservation: Reservation): boolean {
    var currentDate = new Date();
    var formatCurrentDate = formatDate(currentDate, 'yyyy-MM-dd', 'en-US');
    if (reservation.endDate! >= formatCurrentDate) {
      return true;
    }
    return false;
  }

  clickAcceptRequestBooking(reservationId: any) {
    this.messQuestion = 'Bạn có chấp nhận đặt chỗ ở của khách không ?';
    this.messQuestionType = 'accept';
    this.currentReservationId = reservationId;
  }

  clickDeclineRequestBooking(reservationId: any) {
    this.messQuestion = 'Bạn có chắc muốn từ chối đặt chỗ ở của khách không ?';
    this.messQuestionType = 'decline';
    this.currentReservationId = reservationId;
  }

  clickCheckIn(reservationId: any) {
    this.messQuestion = 'Bạn có chắc khách nhận chỗ ở không ?';
    this.messQuestionType = 'checkIn';
    this.currentReservationId = reservationId;
  }

  clickCancelBooking(reservationId: any) {
    this.messQuestion = 'Bạn có chắc muốn huỷ đặt chỗ theo yêu cầu của khách không ?';
    this.messQuestionType = 'cancel';
    this.currentReservationId = reservationId;
  }

  clickCheckOut(reservationId: any) {
    this.messQuestion = 'Bạn có chắc khách trả chỗ ở không ?';
    this.messQuestionType = 'checkOut';
    this.currentReservationId = reservationId;
  }

  clickYES(reservationId: any) {
    if (this.messQuestionType == 'decline') {
      this.reservationService.refuse(reservationId).subscribe(
        res => {
          this.showToastMessage('Từ chối đặt chỗ ở thành công', 'success');
          this.currentReservationId = 0;
        },
        error => {
          //console.log(error.message);
          this.showToastMessage(error.message, 'error');
        }
      );
    } else if (this.messQuestionType == 'cancel') {
      this.reservationService.cancel(reservationId).subscribe(
        res => {
          this.showToastMessage('Yêu cầu huỷ đặt chỗ ở thành công', 'success');
          this.currentReservationId = 0;
        },
        error => {
          //console.log(error.message);
          this.showToastMessage(error.message, 'error');
        }
      );

    } else if (this.messQuestionType == 'accept') {
      this.reservationService.accept(reservationId).subscribe(
        res => {
          this.showToastMessage('Chấp nhận đặt chỗ ở thành công', 'success');
          this.currentReservationId = 0;
        },
        error => {
          //console.log(error);
          this.showToastMessage(error.message, 'error');
        }
      );

    } else if (this.messQuestionType == 'checkIn') {
      this.reservationService.checkin(reservationId).subscribe(
        res => {
          this.showToastMessage('Khách đã nhận chỗ ở thành công', 'success');
          this.currentReservationId = 0;
        },
        error => {
          //console.log(error.message);
          this.showToastMessage(error.message, 'error');
        }
      );

    } else if (this.messQuestionType == 'checkOut') {
      this.reservationService.checkout(reservationId).subscribe(
        res => {
          this.showToastMessage('Khách đã trả chỗ ở thành công', 'success');
          this.currentReservationId = 0;
        },
        error => {
          //console.log(error.message);
          this.showToastMessage(error.message, 'error');
        }
      );
    }
  }
}
