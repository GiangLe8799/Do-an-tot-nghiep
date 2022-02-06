import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { District } from '../models/district.model';
import { Homestay } from '../models/homestay.model';
import { Province } from '../models/province.model';
import { DistrictService } from '../Services/district.service';
import { FileUploadService } from '../Services/file-upload.service';
import { HomestayService } from '../Services/homestay.service';
import { ProvinceService } from '../Services/province.service';
import { TokenStorageService } from '../Services/token-storage.service';

@Component({
  selector: 'app-home-search-list',
  templateUrl: './home-search-list.component.html',
  styleUrls: ['./home-search-list.component.scss']
})
export class HomeSearchListComponent implements OnInit {
  imgDefaultHomestay: string = "./assets/images/defaultHomestay.jpg";
  totalPage: any;
  page: number = 1;
  currency: any = new Intl.NumberFormat('en');

  homestayList: Homestay[] = [];

  searchKey: string = "";
  provinces: Province[] = [];
  districts: District[] = [];
  searchDistrict: string = "all";
  searchProvince: string = "all";
  searchType: string = "all";
  imgList = new Map();
  fileInfos?: Observable<any>;

  constructor(private homestayService: HomestayService, private route: ActivatedRoute, private router: Router,
    private token: TokenStorageService, private provinceService: ProvinceService,
    private districtService: DistrictService, private uploadService: FileUploadService) { }

  ngOnInit(): void {
    document.body.scrollTop = 0;// For Safari
    document.documentElement.scrollTop = 0;// For Chrome, Firefox, IE and Opera
    this.getAllProvinces();
    if (this.token.getSearchKey()) {
      this.searchKey = this.token.getSearchKey()!;
      this.searchHomestayByName();
    }
    if (this.token.getHomestays()) {
      this.homestayList = this.token.getHomestays();
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

  getAllProvinces(): void {
    this.provinceService.getAll().subscribe(
      data => {
        this.provinces = data;
      },
      error => {
        console.log(error);
      }
    );
  }

  getDistrictsByProvince(id: any): void {
    this.districtService.getByProvince(id).subscribe(
      data => {
        this.districts = data;
      },
      error => {
        console.log(error);
      }
    );
  }

  setTypeName(type: any): any {
    switch (type) {
      case 'apartment': {
        return 'Căn hộ dịch vụ';
      }
      case 'homestay': {
        return 'Homestay';
      }
      case 'house': {
        return 'Nhà riêng';
      }
      case 'villa': {
        return 'Biệt thự';
      }
    }

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

  searchHomestayByName(): void {
    this.provinceService.getByName(this.searchKey).subscribe(
      res => {
        if (res != null) {
          this.homestayService.getByPlace(res.id).subscribe(
            data => {
              this.homestayList = [];
              data.forEach(element => {
                if(element.status == 1){
                  this.homestayList.push(element);
                }
              });
            },
            error => {
              this.homestayList = [];
              console.log(error);
            }
          );
        }
      }, () => {
        this.homestayService.getByName(this.searchKey).subscribe(
          data => {
            if (data) {
              this.homestayList = [];
              data.forEach(element => {
                if(element.status == 1){
                  this.homestayList.push(element);
                }
              });
            }
          },
          error => {
            this.homestayList = [];
            console.log(error);
          }
        );
      }
    );

  }

  saveSearchType() {
    this.searchType = (<HTMLSelectElement>document.getElementById('selectTypeHomestay')).value;
  }

  sortByCity(event: any): void {
    if (event.target.value != 'all') {
      this.provinceService.get(event.target.value).subscribe(
        res => {
          this.searchProvince = res.provinceName!;
        }
      );
      this.getDistrictsByProvince(event.target.value);
    }
  }

  searchHomestayByDistrict(event: any) {
    this.searchDistrict = (<HTMLSelectElement>document.getElementById('selectDistrict')).value;
  }

  filterSearch(): void {
    this.provinceService.getByName(this.searchKey).subscribe(
      res => {
        if (res != null) {
          this.homestayService.getByPlace(res.id).subscribe(
            data => {
              this.homestayList = [];
              data.forEach(element => {
                if(element.status == 1){
                  this.homestayList.push(element);
                }
              });
              if (this.searchProvince != 'all' && this.searchDistrict == 'all') {
                this.homestayList = this.searchByTypeAndProvince(this.searchType, this.searchProvince);
              }
              else {
                this.homestayList = this.searchByTypeAndDistrict(this.searchType, this.searchDistrict);
              }
            },
            error => {
              this.homestayList = [];
              console.log(error);
            }
          );
        }
      }, () => {
        this.homestayService.getByName(this.searchKey).subscribe(
          data => {
            if (data) {
              this.homestayList = [];
              data.forEach(element => {
                if(element.status == 1){
                  this.homestayList.push(element);
                }
              });
              if (this.searchProvince != 'all' && this.searchDistrict == 'all') {
                this.homestayList = this.searchByTypeAndProvince(this.searchType, this.searchProvince);
              }
              else {
                this.homestayList = this.searchByTypeAndDistrict(this.searchType, this.searchDistrict);
              }
            }
          },
          error => {
            this.homestayList = [];
            console.log(error);
          }
        );
      }
    );
  }

  sortByPrice(event: any) {
    if (event.target.value == 'asc') {
      this.homestayList.sort(function (a, b) {
        return a.cost! - b.cost!;
      });
    }
    if (event.target.value == 'desc') {
      this.homestayList.sort(function (a, b) {
        return b.cost! - a.cost!;
      });
    }
  }

  refreshFilter() {

  }

  searchByTypeAndDistrict(type: string, district: string): any {
    if (type != 'all' && district != 'all') {
      let newList: Homestay[] = [];
      this.homestayList.forEach((hs) => {
        if (hs.homestayTypeName == type && hs.destination!.district!.districtName == district) {
          newList.push(hs);
        }
      });
      return newList;
    }
    if (type == 'all' && district != 'all') {
      let newList: Homestay[] = [];
      this.homestayList.forEach((hs) => {
        if (hs.destination!.district!.districtName == district) {
          newList.push(hs);
        }
      });
      return newList;
    }
    if (type != 'all' && district == 'all') {
      let newList: Homestay[] = [];
      this.homestayList.forEach((hs) => {
        if (hs.homestayTypeName == type) {
          newList.push(hs);
        }
      });
      return newList;
    }
    if (type == 'all' && district == 'all') {
      return this.homestayList;
    }
  }

  searchByTypeAndProvince(type: string, city: string): any {
    if (type != 'all' && city != 'all') {
      let newList: Homestay[] = [];
      this.homestayList.forEach((hs) => {
        if (hs.homestayTypeName == type && hs.destination!.district!.province!.provinceName == city) {
          newList.push(hs);
        }
      });
      return newList;
    }
    if (type == 'all' && city != 'all') {
      let newList: Homestay[] = [];
      this.homestayList.forEach((hs) => {
        if (hs.destination!.district!.province!.provinceName == city) {
          newList.push(hs);
        }
      });
      return newList;
    }
    if (type != 'all' && city == 'all') {
      let newList: Homestay[] = [];
      this.homestayList.forEach((hs) => {
        if (hs.homestayTypeName == type) {
          newList.push(hs);
        }
      });
      return newList;
    }
    if (type == 'all' && city == 'all') {
      return this.homestayList;
    }
  }

}
