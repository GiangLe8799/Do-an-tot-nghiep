import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Feedback } from '../models/feedback.model';
import { Homestay } from '../models/homestay.model';
import { DestinationService } from '../Services/destination.service';
import { FeedbackService } from '../Services/feedback.service';
import { FileUploadService } from '../Services/file-upload.service';
import { HomestayService } from '../Services/homestay.service';
import { ProvinceService } from '../Services/province.service';
import { TokenStorageService } from '../Services/token-storage.service';
declare var jQuery: any;
@Component({
  selector: 'app-homestay-detail',
  templateUrl: './homestay-detail.component.html',
  styleUrls: ['./homestay-detail.component.scss']
})
export class HomestayDetailComponent implements OnInit {
  public imgAvaComment: string = '/assets/images/defaultAva.jpg';

  imgDetail1: string = "./assets/images/HomestayDetail1.jpg";
  imgDetail2: string = "./assets/images/HomestayDetail2.jpg";
  imgDetail3: string = "./assets/images/HomestayDetail3.jpg";
  imgDetail4: string = "./assets/images/HomestayDetail4.jpg";
  imgDetail5: string = "./assets/images/HomestayDetail5.jpg";
  imgDetail6: string = "./assets/images/HomestayDetail6.jpg";

  totalPage: any;
  page: number = 1;

  time: Date = new Date();
  year: string = formatDate(this.time, 'yyyy', 'en-US');
  month: string = formatDate(this.time, 'MM', 'en-US');
  day: string = formatDate(this.time, 'dd', 'en-US');
  messErrorDate: string = '';
  currency: any = new Intl.NumberFormat('en');

  isCheckedStar1: boolean = false;
  isCheckedStar2: boolean = false;
  isCheckedStar3: boolean = false;
  isCheckedStar4: boolean = false;
  isCheckedStar5: boolean = false;

  // amountPerson:number = 1;
  // maxAmountPerson:number = 10;
  isDisabledBtnMinus: boolean = false;
  isDisabledBtnPlus: boolean = false;
  public currentProvinceName = '';
  public currentDestinationName = '';
  currentHomestay: Homestay = {};
  public retrieveParams: Params = {
    currentProvinceId: 0,
    currentDestinationId: 0,
    currentHomestayId: 0
  }
  public bookingInfo = {
    startDate: '',
    endDate: '',
    numberPeople: 1
  }
  feedbacks: Feedback[] = [];
  fileInfos?: Observable<any>;
  imgList = new Map();

  constructor(private route: ActivatedRoute, private router: Router, private provinceService: ProvinceService,
    private homestayService: HomestayService, private destinationService: DestinationService,
    private feedbackService: FeedbackService, private uploadService: FileUploadService, private token: TokenStorageService) { }

  ngOnInit(): void {
    document.body.scrollTop = 0;// For Safari
    document.documentElement.scrollTop = 0;// For Chrome, Firefox, IE and Opera
    this.route.queryParams.subscribe(params => {
      this.retrieveParams = params;
    });
    this.getCurrentHomestay(this.retrieveParams.currentHomestayId);
    this.getProvinceNameById(this.retrieveParams.currentProvinceId);
    this.uploadService.getFiles().subscribe(
      data => {
        this.fileInfos = data;
        this.fileInfos!.forEach(element => {
          this.imgList.set(element.name, element.url);
        });
      }
    );
  }

  navigateToPlace(currentProvinceId: any): void {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        currentProvinceId: currentProvinceId
      }
    }
    this.router.navigate(['place'], navigationExtras);
  }

  getFeedbacksByHomestay(): void {
    this.feedbackService.getByHomestay(this.currentHomestay.id).subscribe(
      res => {
        this.feedbacks = res;
      }, error => {
        console.log(error);
      }
    );
  }

  navigateSightSeeing(currentProvinceId: any, destinationId: any): void {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        currentProvinceId: currentProvinceId,
        currentDestinationId: destinationId
      }
    }
    this.router.navigate(['sightseeing'], navigationExtras);
  }

  navigateToHomestayDetail(currentProvinceId: any, destinationId: any, homestayId: any): void {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        currentProvinceId: currentProvinceId,
        currentDestinationId: destinationId,
        currentHomestayId: homestayId
      }
    }
    this.router.navigate(['homestay-detail'], navigationExtras);
  }

  navigateToBooking() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        startDate: this.bookingInfo.startDate,
        endDate: this.bookingInfo.endDate,
        numberPeople: this.bookingInfo.numberPeople,
        homestayId: this.currentHomestay.id
      }
    }
    this.router.navigate(['booking'], navigationExtras);
  }

  getProvinceNameById(id: any): void {
    this.provinceService.get(id)
      .subscribe(
        data => {
          this.currentProvinceName = data.provinceName!;
        },
        error => {
          console.log(error);
        }
      );
  }

  getDestinationNameById(id: any): void {
    this.destinationService.get(id)
      .subscribe(
        data => {
          this.currentDestinationName = data.destinationName!;
        },
        error => {
          console.log(error);
        }
      );
  }

  getCurrentHomestay(id: any): void {
    this.homestayService.get(id)
      .subscribe(
        data => {
          this.currentHomestay = data;
          this.getDestinationNameById(data.destination!.id);
          this.getFeedbacksByHomestay();
        },
        error => {
          console.log(error);
        }
      );
  }

  checkHomestayAcceptable(): void {
    let dateList = {
      startDate: this.bookingInfo.startDate,
      endDate: this.bookingInfo.endDate
    }
    this.homestayService.checkHomestayAcceptable(dateList, this.currentHomestay.id)
      .subscribe(
        data => {
          if (data != null) {
            this.navigateToBooking();
            this.messErrorDate = '';
          }
          else {
            this.messErrorDate = 'Homestay đã bận trong khoảng thời gian này. Xin vui lòng chọn thời điểm khác!';
          }
        },
        err => {
          console.log(err);
        }
      );

  }

  public searchHomestayByDate() {
    if(!this.token.getToken()){
      this.router.navigate(['auth/login']);
    }
    let startDate = (<HTMLInputElement>document.getElementById('startDate')).value.trim();
    let endDate = (<HTMLInputElement>document.getElementById('endDate')).value.trim();
    let today = new Date(formatDate(this.time, 'yyyy/MM/dd', 'en-US'));
    if (startDate == null || endDate == null || startDate.length == 0 || endDate.length == 0) {
      this.messErrorDate = 'bạn cần chọn đầy đủ thời gian';
    } else {
      let startTime = new Date(formatDate(startDate, 'yyyy/MM/dd', 'en-US'));
      let endTime = new Date(formatDate(endDate, 'yyyy/MM/dd', 'en-US'));
      if (startTime.getTime() < today.getTime() || endTime.getTime() < today.getTime()) {
        this.messErrorDate = 'chọn thời gian từ ' + formatDate(this.time, 'dd/MM/yyyy', 'en-US') + ' trở lên';
      } else if (startTime.getTime() > endTime.getTime()) {
        this.messErrorDate = 'chọn thời gian từ ' + formatDate(startDate, 'dd/MM/yyyy', 'en-US') + ' trở lên';
      } else {
        this.messErrorDate = '';
        this.checkHomestayAcceptable();
      }
    }
  }

  public minusAmountPerson() {
    if (this.bookingInfo.numberPeople > 1) {
      this.isDisabledBtnPlus = false;
      this.bookingInfo.numberPeople -= 1;
    } else {
      this.isDisabledBtnMinus = true;
    }
  }

  public plusAmountPerson() {
    if (this.bookingInfo.numberPeople < this.currentHomestay.maxPeople!) {
      this.isDisabledBtnMinus = false;
      this.bookingInfo.numberPeople += 1;
    } else {
      this.isDisabledBtnPlus = true;
    }
  }

}
