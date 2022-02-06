import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Homestay } from '../models/homestay.model';
import { User } from '../models/user.model';
import { FileUploadService } from '../Services/file-upload.service';
import { HomestayService } from '../Services/homestay.service';
import { ProvinceService } from '../Services/province.service';
import { ReservationService } from '../Services/reservation.service';
import { TokenStorageService } from '../Services/token-storage.service';
import { UserService } from '../Services/user.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {
  imgDefaultHomestay: string = "./assets/images/defaultHomestay.jpg";
  bookingForm = this.formBuilder.group({
    name: [''],
    phone: [''],
    email: ['']
  });
  messErrorName: string = "";
  messErrorPhone: string = "";
  messErrorEmail: string = "";

  /* Toast message */
  displaySuccessMess: boolean = false;
  displayErrorMess: boolean = false;
  mess: string = '';

  public retrieveParams: Params = {
    startDate: '',
    endDate: '',
    numberPeople: 0,
    homestayId: 0
  }
  public currentHomestay: Homestay = {};
  public days = 0;
  public totalMoney = 0;
  public currentUser: User = {};
  isLoggin = false;
  currency: any = new Intl.NumberFormat('en');
  fileInfos?: Observable<any>;
  imgList = new Map();

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private homestayService: HomestayService,
    private token: TokenStorageService, private router: Router, private userService: UserService,
    private reservationService: ReservationService, private provinceService: ProvinceService,
    private uploadService: FileUploadService) {
  }

  ngOnInit(): void {
    document.body.scrollTop = 0;// For Safari
    document.documentElement.scrollTop = 0;// For Chrome, Firefox, IE and Opera
    (<HTMLInputElement>document.getElementById("fullname")).addEventListener("input", this.forceLower);
    this.route.queryParams.subscribe(params => {
      this.retrieveParams = params;
    });
    this.days = this.getDays(this.retrieveParams.startDate, this.retrieveParams.endDate);
    this.getCurrentHomestay(this.retrieveParams.homestayId);
    if (this.token.getToken()) {
      this.isLoggin = true;
      this.getCurrentUser(this.token.getUser().username);
    }
    else {
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
    window.sessionStorage.removeItem("search-key");
  }

  showToastMessage(message: string, typeMess: string) {
    if (typeMess == 'success') {
      this.displaySuccessMess = true;
      this.mess = message;
      setTimeout(() => {
        this.displaySuccessMess = false;
        this.mess = '';
      }, 2000);
    } else if (typeMess == 'error') {
      this.displayErrorMess = true;
      this.mess = message;
      setTimeout(() => {
        this.displayErrorMess = false;
        this.mess = '';
      }, 2000);
    }
  }


  getCurrentHomestay(id: any): void {
    this.homestayService.get(id)
      .subscribe(
        data => {
          this.currentHomestay = data;
          console.log(this.currentHomestay.cost! + ' and ' + this.days);
          this.totalMoney = this.currentHomestay.cost! * this.days;
        },
        error => {
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

  getCurrentUser(userName: string): void {
    this.userService.getByUsername(userName)
      .subscribe(
        data => {
          this.currentUser = data;
          this.bookingForm.controls.name.setValue(this.currentUser.fullName);
          this.bookingForm.controls.phone.setValue(this.currentUser.phoneNumber);
          this.bookingForm.controls.email.setValue(this.currentUser.email);
        },
        error => {
          console.log(error);
        }
      );
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

  createReservation(): void {
    let reservation = {
      status: 0,
      startDate: this.retrieveParams.startDate,
      endDate: this.retrieveParams.endDate,
      numberOfPeople: this.retrieveParams.numberPeople,
      createdDate: '',
      checkinDate: '',
      checkoutDate: '',
      cost: this.totalMoney,
      user: this.currentUser,
      homestay: this.currentHomestay
    }
    console.log(reservation);
    this.reservationService.create(reservation)
      .subscribe(
        data => {
          console.log(data);
        },
        error => {
          //console.log(error);
          this.showToastMessage(error, 'error');
        }
      );
  }

  submitBooking() {
    let fullname = this.bookingForm.controls.name.value;
    let phone = this.bookingForm.controls.phone.value;
    let email = this.bookingForm.controls.email.value;
    if (this.validName(fullname) &&
      this.validPhone(phone) &&
      this.validEmail(email)) {
      this.showToastMessage('Đặt chỗ ở thành công', 'success');
      this.createReservation();
      this.bookingForm.controls.name.setValue('');
      this.bookingForm.controls.phone.setValue('');
      this.bookingForm.controls.email.setValue('');
      setTimeout(() => {
        this.navigateToHomestayDetail(this.currentHomestay.destination!.id, this.currentHomestay.id)
      }, 3000);
    }
  }

  private forceLower(evt: any) {
    // Get an array of all the words (in all lower case)
    var words = evt.target.value.toLowerCase().split(/\s+/g);
    // Loop through the array and replace the first letter with a cap
    var newWords = words.map(function (element: any) {
      // As long as we're not dealing with an empty array element, return the first letter
      // of the word, converted to upper case and add the rest of the letters from this word.
      // Return the final word to a new array
      return element !== "" ? element[0].toUpperCase() + element.substr(1, element.length) : "";
    });
    // Replace the original value with the updated array of capitalized words.
    evt.target.value = newWords.join(" ");
  }

  private isNOTName(name: string) {
    let regex = /[0-9*|\":<>[\]{}`\\()';@&$!#%^+/,.?~\-]/g;
    let result = regex.test(name);
    return result;
  }
  private validName(name: string) {
    let isValid = false;
    if (this.isNOTName(name) == true) {
      this.messErrorName = 'Tên không được có số hoặc kí tự đặc biệt';
      isValid = false;
    } else {
      this.messErrorName = '';
      name = name.replace(/\s\s+/g, ' ');
      isValid = true;
    }

    return isValid;
  }

  private isCorrectPhone(phone: string) {
    let regex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g;
    let result = regex.test(phone);
    return result;
  }
  private validPhone(tel: string) {
    tel = tel.replace(/\s+/g, '');
    let isValid = false;
    if (this.isCorrectPhone(tel) == false) {
      this.messErrorPhone = 'Số điện thoại không đúng định dạng';
      isValid = false;
    } else if (tel.length < 10) {
      this.messErrorPhone = 'Số điện thoại ít nhất là 10 số';
      isValid = false;
    } else {
      this.messErrorPhone = '';
      isValid = true;
    }
    return isValid;
  }

  private isCorrectEmail(email: string) {
    let regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    let result = regex.test(email);
    return result;
  }

  private validEmail(email: string) {
    let isValid = false;
    if (this.isCorrectEmail(email) == false) {
      this.messErrorEmail = 'Email không đúng định dạng';
      isValid = false;
    } else {
      this.messErrorEmail = '';
      isValid = true;
    }
    return isValid;
  }

}
