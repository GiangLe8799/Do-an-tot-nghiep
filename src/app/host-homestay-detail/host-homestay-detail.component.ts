import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { take } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../models/category-service.model';
import { Destination } from '../models/destination.model';
import { District } from '../models/district.model';
import { Homestay } from '../models/homestay.model';
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
import { TokenStorageService } from '../Services/token-storage.service';
import { UserService } from '../Services/user.service';
import { Observable } from 'rxjs';
import { HttpEventType, HttpResponse } from '@angular/common/http';
declare var jQuery: any;
@Component({
  selector: 'app-host-homestay-detail',
  templateUrl: './host-homestay-detail.component.html',
  styleUrls: ['./host-homestay-detail.component.scss']
})
export class HostHomestayDetailComponent implements OnInit {
  imgsHomestayItem: string = "./assets/images/defaultHomestay.jpg";

  imgThumbHomestay: string = './assets/images/defaultHomestay.jpg';
  imgsHomestayList: string[] = [];
  nameHomestay: string = '';
  typeHomestay: string = '';
  amountPerson: any;
  cityHomestay: string = '';
  districtHomestay: string = '';
  sightseeingHomestay: string = '';
  addressHomestay: string = '';
  priceInWeek: any;
  priceInWeekend: any;
  servicesHomestayList: string[] = [];
  desHomestay: string = '';

  messImgThumbHomestay: string = '';
  messImgsHomestayList: string = '';
  messNameHomestay: string = '';
  messAmountPerson: string = '';
  messAddressHomestay: string = '';
  messPriceInWeek: string = '';
  messPriceInWeekend: string = '';
  messServicesHomestayList: string = '';
  messDesHomestay: string = '';

  currency:any = new Intl.NumberFormat('en');

  @ViewChild('inputImgThumb') inputImgThumb!: ElementRef;
  isDisplayNoneImgThumb: boolean = true;
  isDisplayNoneAddImgThumb: boolean = false;

  /* Toast message */
  displaySuccessMess: boolean = false;
  displayErrorMess: boolean = false;
  mess: string = '';

  retrieveParams: any = {
    currentHomestayId: 0
  }
  currentUser: User = {};
  currentHomestay: Homestay = {};
  services: CategoryService[] = [];
  provinces: Province[] = [];
  districts: District[] = [];
  destinations: Destination[] = [];
  newProvince: Province = {};
  newDistrict: District = {};
  newDestination: Destination = {};
  currentProvinceId = 0;
  serviceListForHomestay: Service[] = [];
  typeList = ['homestay', 'apartment', 'house', 'villa'];

  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  imgNotChange = false;

  fileInfos?: Observable<any>;

  fileImgsHomestayList: any;

  constructor(private formBuilder: FormBuilder, private compressImg: CompressImageService, private route: ActivatedRoute,
    private router: Router, private categoryService: CategoryServiceService, private userService: UserService,
    private token: TokenStorageService, private homestayService: HomestayService, private provinceService: ProvinceService,
    private districtService: DistrictService, private destinationService: DestinationService,
    private uploadService: FileUploadService) { }

  ngOnInit(): void {
    document.body.scrollTop = 0;// For Safari
    document.documentElement.scrollTop = 0;// For Chrome, Firefox, IE and Opera
    this.route.queryParams.subscribe(params => {
      this.retrieveParams = params;
    });
    this.getCurrentHomestay(this.retrieveParams.currentHomestayId);
    if (this.token.getToken()) {
      this.getCurrentUser(this.token.getUser().username);
    }

  }

  getCurrentHomestayImg(): void {
    this.uploadService.getFiles().subscribe(
      data => {
        this.fileInfos = data;
        this.fileInfos!.forEach(element => {
          if (element.name == 'homestay' + this.currentHomestay.homestayName + '.jpg') {
            this.isDisplayNoneImgThumb = false;
            this.isDisplayNoneAddImgThumb = true;
            this.imgThumbHomestay = element.url;
            this.imgNotChange = true;
          }
        });
      }
    );
  }

  upload(imgName: any): void {
    this.progress = 0;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      if (file) {
        this.currentFile = new File([file], imgName, { type: 'image/jpg' });
        this.uploadService.upload(this.currentFile).subscribe(
          (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;
              this.uploadService.getFiles().subscribe(
                data => {
                  this.fileInfos = data;
                }
              );
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

  getNameOfTypeList(type: any): any {
    switch (type) {
      case 'homestay': {
        return 'Homestay';
      }
      case 'apartment': {
        return 'Căn hộ dịch vụ';
      }
      case 'house': {
        return 'Nhà riêng';
      }
      case 'villa': {
        return 'Biệt thự';
      }
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

  getCurrentHomestay(id: any): void {
    this.homestayService.get(id).subscribe(
      data => {
        this.currentHomestay = data;
        this.desHomestay = <string>this.currentHomestay.description;
        this.serviceListForHomestay = data.services!;
        this.getCurrentHomestayImg();
        this.getServices();
        this.getUpdateProvinces();
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

  getUpdateProvinces(): void {
    this.provinceService.getAll()
      .subscribe(
        data => {
          this.provinces = data;
          this.getUpdateDistricts(0);
        },
        error => {
          console.log(error);
        }
      );
  }

  getUpdateDistricts(event: any): void {
    let id = 0;
    if (event == 0) {
      id = this.currentHomestay.destination!.district!.province!.id;
      this.getUpdateDestinations(0);
    }
    else {
      id = event.target.value;
    }
    this.districtService.getByProvince(id)
      .subscribe(
        data => {
          this.districts = data;
        },
        error => {
          console.log(error);
        }
      );
  }

  getUpdateDestinations(event: any): void {
    let id = 0;
    if (event == 0) {
      id = this.currentHomestay.destination!.district!.id;
      this.getNewDestination(0);
    }
    else {
      id = event.target.value;
    }
    this.getNewDistrict(id);
    this.destinationService.getByDistrict(id)
      .subscribe(
        data => {
          this.destinations = data;
        },
        error => {
          console.log(error);
        }
      );
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

  checkServiceOfHomestay(serviceName: any): any {
    for (let i = 0; i < this.currentHomestay.services!.length; i++) {
      if (serviceName == this.currentHomestay.services![i].serviceName) {
        return true;
      }
    }
    return false;
  }

  getServiceById(id: any): void {
    this.categoryService.get(id).subscribe(
      data => {
        this.serviceListForHomestay.push(data);
        console.log(this.serviceListForHomestay);
      },
      error => {
        console.log(error);
      }
    );
  }

  getNewProvince(id: any) {
    this.provinceService.get(id)
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

  getNewDistrict(id: any) {
    this.districtService.get(id)
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
      id = this.currentHomestay.destination!.id;
    }
    else {
      id = event.target.value;
    }
    this.destinationService.get(id)
      .subscribe(
        data => {
          this.newDestination = data;
        },
        error => {
          console.log(error);
        }
      );
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

  submitAddHomestay() {
    this.nameHomestay = (<HTMLInputElement>document.getElementById('name')).value;
    this.typeHomestay = (<HTMLSelectElement>document.getElementById('type')).value;
    this.amountPerson = (<HTMLInputElement>document.getElementById('amount')).value;
    this.addressHomestay = (<HTMLInputElement>document.getElementById('address')).value;
    this.priceInWeek = parseFloat((<HTMLInputElement>document.getElementById('priceInWeek')).value);
    //this.desHomestay = (<HTMLInputElement>document.getElementById('desHomestay')).value;
    if (
      this.validImgThumb(this.imgThumbHomestay) &&
      this.validName(this.nameHomestay) &&
      this.validAmountPerson(this.amountPerson) &&
      this.validAddressHomestay(this.addressHomestay) &&
      this.validPriceInWeek(this.priceInWeek) &&
      //this.validServiceHomstay(this.servicesHomestayList) &&
      this.validDesHomestay(this.desHomestay)
    ) {
      if (!this.imgNotChange) {
        this.uploadService.deleteFile('homestay' + this.nameHomestay).subscribe(
          res => {
            this.upload('homestay' + this.nameHomestay + '.jpg');
          },
          error => {
            console.log(error.message);
          }
        );
      }
      let data = {
        id: this.currentHomestay.id,
        homestayName: this.nameHomestay,
        status: this.currentHomestay.status,
        address: this.addressHomestay,
        description: this.desHomestay,
        cost: this.priceInWeek,
        maxPeople: this.amountPerson,
        numbOfBedroom: 2,
        numbOfBathroom: 2,
        homestayTypeName: this.typeHomestay,
        destination: this.newDestination,
        services: this.serviceListForHomestay,
        user: this.currentUser,
        thumbnail: 'homestay' + this.nameHomestay
      }
      this.homestayService.update(data).subscribe(
        res => {
          this.showToastMessage('Chỉnh sửa thành công', 'success');
          this.router.navigate(['host/homestay-list']);
        },
        error => {
          this.showToastMessage('Chỉnh sửa thất bại', 'error');
        }
      );
    }

    // this.compressImg.compress(this.imgCropped)
    // .pipe(take(1)).subscribe(compressedImg => {
    //   this.imgCroppedCompress = compressedImg;
    //   //console.log('size comp: '+ compressedImg);
    //   //upload img here
    // });
  }

  private validImgThumb(imgThumb: string) {
    let isValid = false;
    if (imgThumb == null || imgThumb.length == 0) {
      this.messImgThumbHomestay = '*Không được để trống';
      isValid = false;
    } else {
      this.messImgThumbHomestay = '';
      imgThumb = imgThumb.replace(/\s\s+/g, ' ');
      isValid = true;
    }
    return isValid;
  }

  onSelectImageThumb(e: any) {
    this.selectedFiles = e.target.files;
    if (e.target.files && e.target.value.length != 0) {
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.imgThumbHomestay = event.target.result;
      }
      reader.readAsDataURL(e.target.files[0]);
      this.isDisplayNoneImgThumb = false;
      this.isDisplayNoneAddImgThumb = true;
      this.imgNotChange = false;

    }
  }

  cancelAddImgThumb() {
    this.isDisplayNoneImgThumb = true;
    this.isDisplayNoneAddImgThumb = false;
    this.imgNotChange = true;
    this.inputImgThumb.nativeElement.value = '';
    this.imgThumbHomestay = './assets/images/defaultHomestay.jpg';
  }

  private validMultiImagesHomestay(imgsHomestayList: string[]) {
    let isValid = false;
    if (imgsHomestayList.length < 5) {
      this.messImgsHomestayList = 'Bạn cần thêm tối thiểu 5 bức ảnh về chỗ nghỉ này';
      isValid = false;
    } else {
      this.messImgsHomestayList = '';
      isValid = true;
    }
    return isValid;
  }

  onSelectMultiImagesHomestay(e: any) {
    if (e.target.files && e.target.value.length != 0) {
      this.fileImgsHomestayList = e.target.files;
      for (let i = 0; i < this.fileImgsHomestayList.length; i++) {
        let reader = new FileReader();
        reader.readAsDataURL(e.target.files[i]);
        reader.onload = (event: any) => {
          this.imgsHomestayList.push(event.target.result);
        }
      }
      console.log(this.imgsHomestayList);
    }
  }

  deleteMultiImagesHomestay(index: number) {
    if (index !== -1) {
      this.imgsHomestayList.splice(index, 1);
      console.log(this.imgsHomestayList);
    }
  }

  private validName(name: string) {
    let isValid = false;
    if (name == null || name.length == 0) {
      this.messNameHomestay = '*Không được để trống';
      isValid = false;
    } else if (name.length >= 50) {
      this.messAmountPerson = '*Không dài quá 50 từ';
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
    if (amount < 0) {
      this.messAmountPerson = '*Số lượng người ở tối thiểu là 1 người';
      isValid = false;
    } else if (amount > 100) {
      this.messAmountPerson = '*Số lượng người ở tối đa là 100 người';
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
      this.messAddressHomestay = '*Không được để trống';
      isValid = false;
    } else if(address.length >= 255) {
      this.messAddressHomestay = '*Không dài quá 255 ký tự';
      isValid = false;
    } else {
      this.messAddressHomestay = '';
      address = address.replace(/\s\s+/g, ' ');
      isValid = true;
    }
    return isValid;
  }

  private validPriceInWeek(priceInWeek: number) {
    let isValid = false;
    if (priceInWeek <= 100000) {
      this.messPriceInWeek = '*Giá chỗ ở tối thiểu 100.000đ';
      isValid = false;
    } else {
      this.messPriceInWeek = '';
      isValid = true;
    }
    return isValid;
  }

  // private validPriceInWeekend(priceInWeekend: number, priceInWeek: number) {
  //   let isValid = false;
  //   if (priceInWeekend < priceInWeek) {
  //     this.messPriceInWeekend = '*Giá chỗ ở cuối tuần lớn hơn ' + priceInWeek;
  //     isValid = false;
  //   } else {
  //     this.messPriceInWeekend = '';
  //     isValid = true;
  //   }
  //   return isValid;
  // }

  validServiceHomstay(servicesList: string[]) {
    let isValid = false;
    if (servicesList.length < 4) {
      this.messServicesHomestayList = 'Bạn cần thêm tối thiểu 4 dịch vụ/tiện ích về chỗ nghỉ này';
      isValid = false;
    } else {
      this.messServicesHomestayList = '';
      isValid = true;
    }
    return isValid;
  }

  addServiceHomstay(newService: string) {
    if (newService.length != 0) {
      this.servicesHomestayList.push(newService);
    }
    console.log('services: ' + this.servicesHomestayList);
  }

  deleteServiceHomstay(index: number) {
    if (index !== -1) {
      this.servicesHomestayList.splice(index, 1);
      console.log('services: ' + this.servicesHomestayList);
    }
  }

  private validDesHomestay(desHomestay: string) {
    let isValid = false;
    if (desHomestay == null || desHomestay.length == 0) {
      this.messDesHomestay = '*Không được để trống';
      isValid = false;
    } else if (desHomestay.length >= 500) {
      this.messDesHomestay = '*Không dài quá 500 từ';
      isValid = false;
    } else {
      this.messDesHomestay = '';
      isValid = true;
    }
    return isValid;
  }

}
