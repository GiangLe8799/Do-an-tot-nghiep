import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Homestay } from '../models/homestay.model';
import { Province } from '../models/province.model';
import { User } from '../models/user.model';
import { DestinationService } from '../Services/destination.service';
import { FileUploadService } from '../Services/file-upload.service';
import { HomestayService } from '../Services/homestay.service';
import { ProvinceService } from '../Services/province.service';
import { TokenStorageService } from '../Services/token-storage.service';
import { UserService } from '../Services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  banner1: string = "./assets/images/banner1.gif";
  banner2: string = "./assets/images/banner2.jpg";
  banner3: string = "./assets/images/banner3.jpg";
  banner4: string = "./assets/images/banner4.jpg";
  place1: string = "./assets/images/HaNoi.png";
  imgDefaultPlace: string = "./assets/images/defaultPlace.png";
  imgDefaultHomestay: string = "./assets/images/defaultHomestay.jpg";

  json: any;
  totalPagePlace: any;
  totalPageHotHomestay: any;
  totalPageSuggestHomestay: any;
  page: number = 1;
  public homestays: Homestay[] = [];
  public provinces: Province[] = [];
  countDestinations: Map<string, number> = new Map();
  countHomestays: Map<string, number> = new Map();
  public currentUserName = '';
  currency:any = new Intl.NumberFormat('en');
  imgList = new Map();
  fileInfos?: Observable<any>;

  constructor(private homestayService: HomestayService, private provinceService: ProvinceService,
    private destinationService: DestinationService, private token: TokenStorageService,
    private router: Router, private userService: UserService, private uploadService: FileUploadService) { }

  ngOnInit(): void {
    document.body.scrollTop = 0;// For Safari
    document.documentElement.scrollTop = 0;// For Chrome, Firefox, IE and Opera
    this.getProvinces();
    this.getTopHomestays();
    if (this.token.getToken()) {
      // this.isLoggedIn = true;
      this.getCurrentUserFullname(this.token.getUser().username);
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

  getCurrentUserFullname(userName: string): void {
    this.userService.getByUsername(userName)
      .subscribe(
        data => {
          this.currentUserName = ', ' + data.fullName!;
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

  countHomestayByProvince(id: any): void {
    this.homestayService.countByProvinceId(id)
      .subscribe(
        data => {
          this.countHomestays.set('' + id, data);
        },
        err => {
          console.log(err);
        }
      );
  }

  countDestinationByProvince(id: any): void {
    this.destinationService.countByProvinceId(id)
      .subscribe(
        data => {
          this.countDestinations.set('' + id, data);
        },
        err => {
          console.log(err);
        }
      );
  }

  getProvinces(): void {
    this.provinceService.getTop()
      .subscribe(
        data => {
          this.provinces = data;
          for (let i = 0; i < this.provinces.length; i++) {
            this.countDestinationByProvince(this.provinces[i].id);
            this.countHomestayByProvince(this.provinces[i].id)
          }
        },
        error => {
          console.log(error);
        }
      );
  }

  getTopHomestays(): void {
    this.homestayService.topHomestays()
      .subscribe(
        data => {
          this.homestays = data;
        },
        error => {
          console.log(error.message);
        }
      );
  }
}
