import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Blog } from '../models/blog.model';
import { Destination } from '../models/destination.model';
import { Food } from '../models/food.model';
import { Homestay } from '../models/homestay.model';
import { Setting } from '../models/setting.model';
import { BlogService } from '../Services/blog.service';
import { DestinationService } from '../Services/destination.service';
import { FileUploadService } from '../Services/file-upload.service';
import { FoodService } from '../Services/food.service';
import { HomestayService } from '../Services/homestay.service';
import { ProvinceService } from '../Services/province.service';
import { SettingService } from '../Services/setting.service';
import { TokenStorageService } from '../Services/token-storage.service';

@Component({
  selector: 'app-place-homestay',
  templateUrl: './place-homestay.component.html',
  styleUrls: ['./place-homestay.component.scss']
})
export class PlaceHomestayComponent implements OnInit {
  imgPlace: string = "";

  time: Date = new Date();
  year: string = formatDate(this.time, 'yyyy', 'en-US');
  month: string = formatDate(this.time, 'MM', 'en-US');
  day: string = formatDate(this.time, 'dd', 'en-US');
  messErrorDate: string = '';

  totalPage: any;
  page: number = 1;
  public bookingDate = {
    startDate: '',
    endDate: ''
  }
  public retrieveParams: Params = {
    currentProvinceId: 0
  }
  homestays: Homestay[] = [];
  destinations: Destination[] = [];
  foods: Food[] = [];
  blogs: Blog[] = [];
  public currentProvinceName = '';
  imgList = new Map();
  currency:any = new Intl.NumberFormat('en');
  fileInfos?: Observable<any>;
  typeList: Setting[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private provinceService: ProvinceService,
    private homestayService: HomestayService, private destinationService: DestinationService, 
    private foodService: FoodService, private blogService: BlogService, private token: TokenStorageService,
    private uploadService: FileUploadService,private settingService: SettingService) { }

  ngOnInit(): void {
    document.body.scrollTop = 0;// For Safari
    document.documentElement.scrollTop = 0;// For Chrome, Firefox, IE and Opera
    this.route.queryParams.subscribe(params => {
      this.retrieveParams = params;
    });
    this.getProvinceNameById(this.retrieveParams.currentProvinceId);
    this.getHomestaysByPlace(this.retrieveParams.currentProvinceId);
    this.getDestinationsByProvince(this.retrieveParams.currentProvinceId);
    this.getFoodsByProvince(this.retrieveParams.currentProvinceId);
    this.getBlogsByProvince(this.retrieveParams.currentProvinceId);
    this.uploadService.getFiles().subscribe(
      data => {
        this.fileInfos = data;
        this.fileInfos!.forEach(element => {
          this.imgList.set(element.name, element.url);
        });
      }
    );
    this.getTypeSetting();
  }

  getTypeSetting(): void {
    this.settingService.getByType('HOMESTAY_TYPE').subscribe(
      res => {
        this.typeList = res;
      }
    );
  }

  showTypeText(type: any): any {
    let text = '';
    this.typeList.forEach(t => {
      if (t.value == type) {
        text = t.name!;
      }
    });
    return text;
  }

  getHomestaysByPlace(id: any): void {
    this.homestayService.getByPlace(id)
      .subscribe(
        data => {
          data.forEach(element => {
            if(element.status == 1){
              this.homestays.push(element);
            }
          });
        },
        error => {
          console.log(error);
        }
      );
  }

  getFoodsByProvince(provinceId: any): void{
    this.foodService.getByProvince(provinceId)
    .subscribe(
      data => {
        data.forEach(element => {
          if(element.status == 1){
            this.foods.push(element);
          }
        });
      },
      err => {
        console.log(err);
      }
    );
  }

  getBlogsByProvince(provinceId: any): void{
    this.blogService.getTopByProvince(provinceId)
    .subscribe(
      data => {
        data.forEach(element => {
          if(element.status == 1){
            this.blogs.push(element);
          }
        });
      },
      err => {
        console.log(err);
      }
    );
  }

  loadHomestay(): void {
    let date = {
      startDate: this.bookingDate.startDate,
      endDate: this.bookingDate.endDate
    }
    this.homestayService.searchHomestays(date, this.retrieveParams.currentProvinceId)
      .subscribe(
        data => {
          data.forEach(element => {
            if(element.status == 1){
              this.homestays.push(element);
            }
          });
          this.page = 1;
        },
        error => {
          console.log(error);
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

  navigateToBlogDetail(blogId: any): void {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        currentBlogId: blogId
      }
    }
    this.router.navigate(['blog-detail'], navigationExtras);
  }

  getDestinationsByProvince(id: any): void {
    this.destinationService.getByProvince(id)
      .subscribe(
        data => {
          data.forEach(element => {
            if(element.status == 1){
              this.destinations.push(element);
            }
          });
        },
        err => {
          console.log(err);
        }
      );
  }

  getProvinceNameById(id: any): void {
    this.provinceService.get(id)
      .subscribe(
        data => {
          this.currentProvinceName = data.provinceName!;
          this.imgPlace = data.provincePhoto!;
        },
        error => {
          console.log(error);
        }
      );
  }

  public searchHomestayByDate() {
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
        this.messErrorDate = 'bạn không thể chọn thời gian bắt đầu lớn hơn thời gian kết thúc';
      } else {
        this.messErrorDate = '';
        this.loadHomestay();
      }
    }
  }

  public searchHomestayByType(event: any) {
    if(event.target.value != 'all'){
      this.homestayService.getByType(this.retrieveParams.currentProvinceId,event.target.value)
      .subscribe(
        data => {
          data.forEach(element => {
            if(element.status == 1){
              this.homestays.push(element);
            }
          });
          this.page = 1;
        },
        err => {
          this.homestays = [];
          console.log(err);
        }
      );
    }
    else{
      this.getHomestaysByPlace(this.retrieveParams.currentProvinceId);
    }
  }

  public searchHomestayByPrice() {

  }

  sortByPrice(event: any) {
    this.page = 1;
    if (event.target.value == 'asc') {
      this.homestays.sort(function (a, b) {
        return a.cost! - b.cost!;
      });
    }
    if (event.target.value == 'desc') {
      this.homestays.sort(function (a, b) {
        return b.cost! - a.cost!;
      });
    }
  }
}
