import { formatNumber } from '@angular/common';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { CategoryService } from '../models/category-service.model';
import { Destination } from '../models/destination.model';
import { District } from '../models/district.model';
import { Province } from '../models/province.model';
import { Service } from '../models/service.model';
import { User } from '../models/user.model';
import { CategoryServiceService } from '../Services/category-service.service';
import { CompressImageService } from '../Services/compress-image.service';
import { DestinationService } from '../Services/destination.service';
import { DistrictService } from '../Services/district.service';
import { FileUploadService } from '../Services/file-upload.service';
import { HomestayService } from '../Services/homestay.service';
import { ProvinceService } from '../Services/province.service';
import { ReservationService } from '../Services/reservation.service';
import { TokenStorageService } from '../Services/token-storage.service';
import { UserService } from '../Services/user.service';

@Component({
  selector: 'app-host-homestay-new',
  templateUrl: './host-homestay-new.component.html',
  styleUrls: ['./host-homestay-new.component.scss']
})
export class HostHomestayNewComponent implements OnInit {
  imgThumbnail:string = "./assets/images/defaultHomestay.jpg";
  imgsHomestayItem:string = "./assets/images/defaultHomestay.jpg";

  imgThumbHomestay:string='';
  imgsHomestayList:string[] = [];
  nameHomestay:string='';
  typeHomestay:string='';
  amountPerson:any;
  cityHomestay:string='';
  districtHomestay:string='';
  sightseeingHomestay:string='';
  addressHomestay:string='';
  priceInWeek:any;
  priceInWeekend:any;
  servicesHomestayList:string[] = [];
  desHomestay:string='';

  messImgThumbHomestay:string='';
  messImgsHomestayList:string='';
  messNameHomestay:string='';
  messAmountPerson:string='';
  messAddressHomestay:string='';
  messPriceInWeek:string='';
  messPriceInWeekend:string='';
  messServicesHomestayList:string = '';
  messDesHomestay:string='';

  currentUser: User = {};
  services: CategoryService[] = [];
  provinces: Province[] = [];
  districts: District[] = [];
  destinations: Destination[] = [];
  newProvince: Province = {};
  newDistrict: District = {};
  newDestination: Destination = {};
  currentProvinceId = 0;
  serviceListForHomestay: Service[] = [];

  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';

  fileImgsHomestayList:any;
  @ViewChild('inputImgThumb') inputImgThumb!:ElementRef;
  isDisplayNoneImgThumb:boolean = true;
  isDisplayNoneAddImgThumb:boolean = false;

  /* Toast message */
  displaySuccessMess:boolean = false;
  displayErrorMess:boolean = false;
  mess:string='';

  constructor(private formBuilder: FormBuilder, private compressImg: CompressImageService,  private categoryService: CategoryServiceService,
    private userService: UserService, private token: TokenStorageService, private homestayService: HomestayService,
    private provinceService: ProvinceService, private districtService: DistrictService, private destinationService: DestinationService,
    private uploadService: FileUploadService, private router: Router) { }

  ngOnInit(): void {
    document.body.scrollTop = 0;// For Safari
    document.documentElement.scrollTop = 0;// For Chrome, Firefox, IE and Opera
    if (this.token.getToken()) {
      this.getCurrentUser(this.token.getUser().username);
    }
    this.getServices();
    this.getAllProvinces();
  }

  showToastMessage(message:string, typeMess: string) {
    if(typeMess == 'success') {
      this.displaySuccessMess = true;
      this.mess = message;
      setTimeout(()=>{
        this.displaySuccessMess = false;
        this.mess = '';
        this.router.navigate(['host/homestay-list']);
      },2000);
    }else if(typeMess == 'error') {
      this.displayErrorMess = true;
      this.mess = message;
      setTimeout(()=>{
        this.displayErrorMess = false;
        this.mess = '';
      },2000);
    }
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  upload(imgName: any): void {
    this.progress = 0;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = new File([file], imgName, { type: 'image/jpeg' });
        // this.currentFile = file;

        this.uploadService.upload(this.currentFile).subscribe(
          (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;
            }
          },
          (err: any) => {
            console.log(err);
            this.progress = 0;

            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the file!';
            }

            this.currentFile = undefined;
          });

      }

      this.selectedFiles = undefined;
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

  getServices(): void {
    this.categoryService.getAll().subscribe(
      data => {
        this.services = data;
      },
      error => {
        console.log(error);
      }
    );
  }

  getDistrictsByProvince(provinceId: any): void {
    this.districtService.getByProvince(provinceId)
      .subscribe(
        data => {
          this.districts = data;
        },
        error => {
          console.log(error);
        }
      );
  }

  getAllProvinces() {
    this.provinceService.getAll()
      .subscribe(
        data => {
          this.provinces = data;
        },
        error => {
          console.log(error);
        }
      );
  }

  getDestinationsByProvince(provinceId: any): void {
    this.destinationService.getByProvince(provinceId)
      .subscribe(
        data => {
          this.destinations = data;
        },
        error => {
          console.log(error);
        }
      );
  }

  getDestinationsByDistrict(districtId: any): void {
    this.destinationService.getByDistrict(districtId)
      .subscribe(
        data => {
          this.destinations = data;
          this.getNewDestination(0);
        },
        error => {
          console.log(error);
        }
      );
  }

  changeCity(event: any) {
    this.currentProvinceId = event.target.value;
    this.getDistrictsByProvince(event.target.value);
    this.getDestinationsByProvince(event.target.value);
    this.getNewProvince(event);
  }

  changeDistrict(event: any) {
    this.getNewDistrict(event);
    this.getDestinationsByDistrict(event.target.value);
  }

  onChangeService(event: any) {
    if (event.target.checked) {
      console.log(event.target.value);
      this.getServiceById(event.target.value);
    }
    if (!event.target.checked) {
      this.serviceListForHomestay.forEach((element, index) => {
        if (element.serviceName == event.target.name) {
          this.serviceListForHomestay.splice(index, 1);
        }
      });
    }
  }

  getServiceById(id: any): void {
    this.categoryService.get(id).subscribe(
      data => {
        this.serviceListForHomestay.push(data);
      },
      error => {
        console.log(error);
      }
    );
  }

  getNewProvince(event: any) {
    this.provinceService.get(event.target.value)
      .subscribe(
        data => {
          this.newProvince = data;
          console.log(this.newProvince);
        },
        error => {
          console.log(error);
        }
      );
  }

  getNewDistrict(event: any) {
    this.districtService.get(event.target.value)
      .subscribe(
        data => {
          this.newDistrict = data;
          console.log(this.newDistrict);
        },
        error => {
          console.log(error);
        }
      );
  }

  getNewDestination(event: any) {
    let id;
    if (event == 0) {
      id = 1;
    }
    else {
      id = event.target.value;
    }
    this.destinationService.get(id)
      .subscribe(
        data => {
          this.newDestination = data;
          console.log(this.newDestination);
        },
        error => {
          console.log(error);
        }
      );
  }

  submitAddHomestay() {
    this.nameHomestay = (<HTMLInputElement>document.getElementById('name')).value;
    this.typeHomestay = (<HTMLSelectElement>document.getElementById('type')).value;
    this.amountPerson = (<HTMLInputElement>document.getElementById('amount')).value;
    this.addressHomestay = (<HTMLInputElement>document.getElementById('address')).value;
    this.priceInWeek = parseFloat((<HTMLInputElement>document.getElementById('priceInWeek')).value);

    if(
        this.validImgThumb(this.imgThumbHomestay) &&
        this.validName(this.nameHomestay) &&
        this.validAmountPerson(this.amountPerson) &&
        this.validAddressHomestay(this.addressHomestay) &&
        this.validPriceInWeek(this.priceInWeek) &&
        this.validDesHomestay(this.nameHomestay)
      ) {
        let data = {
          homestayName: this.nameHomestay,
          address: this.addressHomestay,
          description: this.desHomestay,
          cost: this.priceInWeek,
          maxPeople: this.amountPerson,
          status: 1,
          numbOfBedroom: 2,
          numbOfBathroom: 2,
          homestayTypeName: this.typeHomestay,
          destination: this.newDestination,
          services: this.serviceListForHomestay,
          user: this.currentUser,
          thumbnail: 'homestay' + this.nameHomestay
        }
        this.homestayService.create(data).subscribe(
          res => {
            this.uploadService.deleteFile('homestay' + this.nameHomestay).subscribe(
              res => {
                this.upload('homestay' + this.nameHomestay + '.jpg');
                this.showToastMessage('T???o homestay th??nh c??ng', 'success');
                (<HTMLInputElement>document.getElementById('name')).value = '';
                (<HTMLInputElement>document.getElementById('amount')).value = '1';
                (<HTMLInputElement>document.getElementById('address')).value = '';
                (<HTMLInputElement>document.getElementById('priceInWeek')).value = '0';
                (<HTMLInputElement>document.getElementById('desHomestay')).value = '';
              }
            );
          },
          error => {
            this.showToastMessage('T???o homestay th???t b???i', 'error');
            console.log(error.message);
          }
        );
      }
  }

  private validImgThumb(imgThumb:string) {
    let isValid = false;
    if (imgThumb == null || imgThumb.length == 0) {
      this.messImgThumbHomestay = '*Kh??ng ???????c ????? tr???ng';
      isValid = false;
    } else {
      this.messImgThumbHomestay = '';
      imgThumb = imgThumb.replace(/\s\s+/g, ' ');
      isValid = true;
    }
    return isValid;
  }

  onSelectImageThumb(e:any) {
    this.selectedFiles = e.target.files;
    if(e.target.files && e.target.value.length != 0) {
      let reader = new FileReader();
      reader.onload=(event:any)=> {
        this.imgThumbnail= event.target.result;
        this.imgThumbHomestay = this.imgThumbnail;
      }
      reader.readAsDataURL(e.target.files[0]);
      this.isDisplayNoneImgThumb = false;
      this.isDisplayNoneAddImgThumb = true;
    }
  }

  cancelAddImgThumb() {
    this.isDisplayNoneImgThumb = true;
    this.isDisplayNoneAddImgThumb = false;
    this.inputImgThumb.nativeElement.value = '';
    this.imgThumbnail = './assets/images/defaultHomestay.jpg';
    this.imgThumbHomestay = '';
    //console.log( 'add img thumb: '+this.imgThumbHomestay);
  }

  private validMultiImagesHomestay(imgsHomestayList:string[]) {
    let isValid = false;
    if(imgsHomestayList.length < 5) {
      this.messImgsHomestayList = 'B???n c???n th??m t???i thi???u 5 b???c ???nh v??? ch??? ngh??? n??y';
      isValid = false;
    } else {
      this.messImgsHomestayList = '';
      isValid = true;
    }
    return isValid;
  }

  onSelectMultiImagesHomestay(e:any) {
    if(e.target.files && e.target.value.length != 0) {
      this.fileImgsHomestayList = e.target.files;
      for(let i = 0; i < this.fileImgsHomestayList.length; i++) {
        let reader = new FileReader();
        reader.readAsDataURL(e.target.files[i]);
        reader.onload=(event:any)=> {
          this.imgsHomestayList.push(event.target.result);
        }
      }
      console.log(this.imgsHomestayList);
    }
  }

  deleteMultiImagesHomestay(index:number) {
    if(index !== -1) {
      this.imgsHomestayList.splice(index, 1);
      console.log(this.imgsHomestayList);
    }
  }

  private validName(name: string) {
    let isValid = false;
    if (name == null || name.length == 0) {
      this.messNameHomestay = '*Kh??ng ???????c ????? tr???ng';
      isValid = false;
    } else if (name.length >= 50) {
      this.messAmountPerson = '*Kh??ng d??i qu?? 50 t???';
      isValid = false;
    } else {
      this.messNameHomestay = '';
      name = name.replace(/\s\s+/g, ' ');
      isValid = true;
    }
    return isValid;
  }

  private validAmountPerson(amount: number) {
    let isValid = false;
    if (amount <= 0) {
      this.messAmountPerson = '*S??? l?????ng ng?????i ??? t???i thi???u l?? 1 ng?????i';
      isValid = false;
    } else if (amount >= 100) {
      this.messAmountPerson = '*S??? l?????ng ng?????i ??? t???i ??a l?? 100 ng?????i';
      isValid = false;
    } else {
      this.messAmountPerson = '';
      isValid = true;
    }
    return isValid;
  }

  private validAddressHomestay(address: string) {
    let isValid = false;
    if (address == null || address.length == 0) {
      this.messAddressHomestay = '*Kh??ng ???????c ????? tr???ng';
      isValid = false;
    } else if(address.length > 255) {
      this.messAddressHomestay = '*Kh??ng d??i qu?? 255 k?? t???';
      isValid = false;
    }else {
      this.messAddressHomestay = '';
      address = address.replace(/\s\s+/g, ' ');
      isValid = true;
    }
    return isValid;
  }

  private validPriceInWeek(priceInWeek: number) {
    let isValid = false;
    if (priceInWeek < 100000) {
      this.messPriceInWeek = '*Gi?? ch??? ??? t???i thi???u 100.000??';
      isValid = false;
    } else {
      this.messPriceInWeek = '';
      isValid = true;
    }
    return isValid;
  }

  // private validPriceInWeekend(priceInWeekend: number, priceInWeek:number) {
  //   let isValid = false;
  //   if (priceInWeekend < priceInWeek) {
  //     this.messPriceInWeekend = '*Gi?? ch??? ??? cu???i tu???n l???n h??n ' + priceInWeek;
  //     isValid = false;
  //   } else {
  //     this.messPriceInWeekend = '';
  //     isValid = true;
  //   }
  //   return isValid;
  // }

  validServiceHomstay(servicesList:string[]) {
    let isValid = false;
    if(servicesList.length < 4) {
      this.messServicesHomestayList = 'B???n c???n th??m t???i thi???u 4 d???ch v???/ti???n ??ch v??? ch??? ngh??? n??y';
      isValid = false;
    } else {
      this.messServicesHomestayList = '';
      isValid = true;
    }
    return isValid;
  }

  addServiceHomstay(newService:string) {
    if(newService.length != 0) {
      this.servicesHomestayList.push(newService);
    }
    console.log('services: ' +this.servicesHomestayList);
  }

  deleteServiceHomstay(index:number) {
    if(index !== -1) {
      this.servicesHomestayList.splice(index, 1);
      console.log('services: ' +this.servicesHomestayList);
    }
  }

  private validDesHomestay(desHomestay:string) {
    let isValid = false;
    if (desHomestay == null || desHomestay.length == 0) {
      this.messDesHomestay = '*Kh??ng ???????c ????? tr???ng';
      isValid = false;
    } else if (desHomestay.length >= 500) {
      this.messDesHomestay = '*Kh??ng d??i qu?? 500 t???';
      isValid = false;
    } else {
      this.messDesHomestay = '';
      isValid = true;
    }
    return isValid;
  }

}
