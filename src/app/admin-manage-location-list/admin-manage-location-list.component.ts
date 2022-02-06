import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { base64ToFile, ImageCroppedEvent } from 'ngx-image-cropper';
import { Observable } from 'rxjs';
import { Destination } from '../models/destination.model';
import { District } from '../models/district.model';
import { Province } from '../models/province.model';
import { DestinationService } from '../Services/destination.service';
import { DistrictService } from '../Services/district.service';
import { FileUploadService } from '../Services/file-upload.service';
import { ProvinceService } from '../Services/province.service';
import { TokenStorageService } from '../Services/token-storage.service';
declare var jQuery: any;
@Component({
  selector: 'app-admin-manage-location-list',
  templateUrl: './admin-manage-location-list.component.html',
  styleUrls: ['./admin-manage-location-list.component.scss']
})
export class AdminManageLocationListComponent implements OnInit {

  /*show list food by city and district*/
  district: string = '';

  /*add and edit image sightseeing*/
  imgAddSightseeing: string = './assets/images/defaultHomestay.jpg';
  addDescription:string = '';
  imgEditSightseeing: string = './assets/images/defaultHomestay.jpg';
  @ViewChild('inputAddImgSightseeing') inputAddImgSightseeing!: ElementRef;
  @ViewChild('inputEditImgSightseeing') inputEditImgSightseeing!: ElementRef;
  isDisplayNoneAddImgSightseeing: boolean = true;
  isDisplayNoneAddDefaultImgSightseeing: boolean = false;
  messAddImgSightseeing: string = '';
  isDisplayNoneEditImgSightseeing: boolean = false;
  isDisplayNoneEditDefaultImgSightseeing: boolean = true;
  messEditImgSightseeing: string = '';

  messAddDestination: string = '';
  messAddDescription: string = '';
  messEditDestination: string = '';
  messEditDescription: string = '';
  page: number = 1;
  messSearch: string = "";

  currentProvinceId = 0;
  currentDestination: Destination = {};
  destinations: Destination[] = [];
  provinces: Province[] = [];
  districts: District[] = [];
  // newProvince: Province = {};
  newDistricts: District[] = [];
  newDistrict: District = {};
  updateProvinces: Province[] = [];
  updateDistricts: District[] = [];

  allLength = 0;
  activeLength = 0;
  inactiveLength = 0;
  sortId = 0;
  sortType = 'none';


  /* Message question */
  messQuestion: string = '';
  messQuestionType: string = '';

  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  imgList = new Map();
  imgNotChange = false;

  fileInfos?: Observable<any>;

  /*toast message*/
  displaySuccessMess: boolean = false;
  displayErrorMess: boolean = false;
  mess: string = '';

  constructor(private destinationService: DestinationService, private provinceService: ProvinceService,
    private districtService: DistrictService, private uploadService: FileUploadService,
    private token: TokenStorageService) { }

  ngOnInit(): void {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    window.localStorage.removeItem('destinations');
    this.getAllDestinations();
    this.getAllProvinces();
    this.uploadService.getFiles().subscribe(
      data => {
        this.fileInfos = data;
        this.fileInfos!.forEach(element => {
          this.imgList.set(element.name, element.url);
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
        // this.currentFile = file;

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

  getCurrentDestination(id: any): void {
    this.destinationService.get(id)
      .subscribe(
        data => {
          this.currentDestination = data;
          if (this.imgList.get('des' + this.currentDestination.destinationName + '.jpg')) {
            this.imgEditSightseeing = this.imgList.get('des' + this.currentDestination.destinationName + '.jpg');
            this.imgNotChange = true;
          }
          else {
            this.imgEditSightseeing = './assets/images/defaultHomestay.jpg';
          }
          this.getUpdateProvinces();
          this.isDisplayNoneEditImgSightseeing = false;
          this.isDisplayNoneEditDefaultImgSightseeing = true;
        },
        error => {
          console.log(error);
        }
      );
  }

  getDestinationsByProvince(provinceId: any): void {
    if (provinceId == 0) {
      this.getAllDestinations();
    }
    else {
      this.destinationService.getByProvince(provinceId)
        .subscribe(
          data => {
            this.destinations = data;
            window.localStorage.setItem('destinations', JSON.stringify(this.destinations));
            this.allLength = this.destinations.length;
            this.activeLength = this.countStatusDestinations(this.destinations, 1);
            this.inactiveLength = this.countStatusDestinations(this.destinations, 0);
            this.page = 1;
          },
          error => {
            console.log(error);
            this.destinations = [];
            this.allLength = this.destinations.length;
            this.activeLength = this.countStatusDestinations(this.destinations, 1);
            this.inactiveLength = this.countStatusDestinations(this.destinations, 0);
            this.page = 1;
          }
        );
    }

  }

  getDestinationsByDistrict(districtId: any): void {
    this.destinationService.getByDistrict(districtId)
      .subscribe(
        data => {
          this.destinations = data;
          this.allLength = this.destinations.length;
          this.activeLength = this.countStatusDestinations(this.destinations, 1);
          this.inactiveLength = this.countStatusDestinations(this.destinations, 0);
          window.localStorage.setItem('destinations', JSON.stringify(this.destinations));
          this.page = 1;
          this.messSearch = "";
        },
        () => {
          this.destinations = [];
          this.allLength = this.destinations.length;
          this.activeLength = this.countStatusDestinations(this.destinations, 1);
          this.inactiveLength = this.countStatusDestinations(this.destinations, 0);
          this.page = 1;
          this.messSearch = "Không có kết quả";
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

  getAllDestinations() {
    this.destinationService.getAll()
      .subscribe(
        data => {
          this.destinations = data;
          window.localStorage.setItem('destinations', JSON.stringify(this.destinations));
          this.allLength = this.destinations.length;
          this.activeLength = this.countStatusDestinations(this.destinations, 1);
          this.inactiveLength = this.countStatusDestinations(this.destinations, 0);
          this.page = 1;
          this.messSearch = "";
        },
        error => {
          console.log(error);
        }
      );
  }

  countStatusDestinations(list: Destination[], status: number): number {
    let count = 0;
    list.forEach(des => {
      if (des.status === status) {
        count++;
      }
    });
    return count;
  }

  showToastMessage(message: string, typeMess: string) {
    if (typeMess == 'success') {
      this.displaySuccessMess = true;
      this.mess = message;
      setTimeout(() => {
        this.displaySuccessMess = false;
        this.mess = '';
        window.location.reload();
      }, 2000);
    } else if (typeMess == 'error') {
      this.displayErrorMess = true;
      this.mess = message;
      setTimeout(() => {
        this.displayErrorMess = false;
        this.mess = '';
        window.location.reload();
      }, 2000);
    }
  }

  newDestinationProvince(event: any) {
    this.districtService.getByProvince(event.target.value)
      .subscribe(
        data => {
          this.newDistricts = data;
          this.newDistrict = this.newDistricts[0];
        },
        error => {
          console.log(error);
        }
      );
  }

  newDestinationDistrict(event: any) {
    this.districtService.get(event.target.value)
      .subscribe(
        data => {
          this.newDistrict = data;
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
          this.updateProvinces = data;
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
      id = this.currentDestination.district!.province!.id;
    }
    else {
      id = event.target.value;
    }
    this.districtService.getByProvince(id)
      .subscribe(
        data => {
          this.updateDistricts = data;
        },
        error => {
          console.log(error);
        }
      );

  }

  sortByCity(event: any) {
    this.messSearch = "";
    var search = (<HTMLInputElement>document.getElementById("search")).value;
    if (event.target.value == 'all') {
      this.districts = [];
      this.sortId = 0;
      this.sortType = 'none';
      this.currentProvinceId = 0;
      if(search.length == 0) {
        this.getAllDestinations();
      }
      else{
        this.checkSearching();
      }
    }
    else {
      this.currentProvinceId = event.target.value;
      this.getDistrictsByProvince(event.target.value);
      this.sortId = event.target.value;
      this.sortType = 'province';
      if(search.length == 0) {
        this.getDestinationsByProvince(event.target.value);
      }
      else{
        this.checkSearching();
      }
    }

  }

  sortByDistrict(event: any) {
    this.messSearch = "";
    var search = (<HTMLInputElement>document.getElementById("search")).value;
    if (event.target.value == 'all') {
      this.sortType = 'none';
      this.sortId = 0;
      if(search.length == 0) {
        this.getDestinationsByProvince(this.currentProvinceId);
      }
      else{
        this.checkSearching();
      }
    }
    else {
      this.sortId = event.target.value;
      this.sortType = 'district';
      if(search.length == 0) {
        this.getDestinationsByDistrict(event.target.value);
      }
      else{
        this.checkSearching();
      }
    }
  }

  showByAllDestination() {
    const oldDestinations = window.localStorage.getItem('destinations');
    if (oldDestinations) {
      this.destinations = JSON.parse(oldDestinations);
    }
    this.messSearch = "";
    this.page = 1;
  }

  getDestinationByStatus(status: number): void {
    this.destinations = [];
    let newDestinations: Destination[] = [];
    const oldDestinations = window.localStorage.getItem('destinations');
    if (oldDestinations) {
      newDestinations = JSON.parse(oldDestinations);
    }
    newDestinations.forEach(des => {
      if (des.status == status) {
        this.destinations.push(des);
      }
    });
    this.messSearch = "";
    this.page = 1;
  }

  validSearchKey(key: string): boolean {
    var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    this.messSearch = "";
    var inputValid = true;
    if (key.length == 0) {
      this.messSearch = 'Hãy nhập địa điểm nào đó ....';
      inputValid = false;
    } else if (key.length > 50) {
      this.messSearch = "Nhập địa điểm dưới 50 kí tự!";
      inputValid = false;
    }
    if (format.test(key)) {
      this.messSearch = "Không được nhập các kí tự đặc biệt!";
      inputValid = false;
    }
    return inputValid;
  }

  checkSearching() {
    var search = (<HTMLInputElement>document.getElementById("search")).value;
    if (this.validSearchKey(search)) {
      this.destinationService.getByName(search, this.sortType, this.sortId)
        .subscribe(
          data => {
            this.destinations = data;
            window.localStorage.setItem('destinations', JSON.stringify(this.destinations));
            this.allLength = this.destinations.length;
            this.activeLength = this.countStatusDestinations(this.destinations, 1);
            this.inactiveLength = this.countStatusDestinations(this.destinations, 0);
            this.page = 1;
          },
          error => {
            this.destinations = [];
            this.messSearch = "Không tìm thấy địa điểm phù hợp!";
          }
        );

    }
  }

  onSelectAddImgSightseeing(e: any) {
    this.selectedFiles = e.target.files;
    if (e.target.files && e.target.value.length != 0) {
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.imgAddSightseeing = event.target.result;
      }
      reader.readAsDataURL(e.target.files[0]);
      this.isDisplayNoneAddImgSightseeing = false;
      this.isDisplayNoneAddDefaultImgSightseeing = true;
    }
  }


  cancelAddImgSightseeing() {
    this.isDisplayNoneAddImgSightseeing = true;
    this.isDisplayNoneAddDefaultImgSightseeing = false;
    this.inputAddImgSightseeing.nativeElement.value = '';
    // this.showImgDefaultSightseeing = './assets/images/defaultHomestay.jpg';
    this.imgAddSightseeing = './assets/images/defaultHomestay.jpg';
  }

  onSelectEditImgSightseeing(e: any) {
    this.selectedFiles = e.target.files;
    if (e.target.files && e.target.value.length != 0) {
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.imgEditSightseeing = event.target.result;
      }
      reader.readAsDataURL(e.target.files[0]);
      this.isDisplayNoneEditImgSightseeing = false;
      this.isDisplayNoneEditDefaultImgSightseeing = true;
      this.imgNotChange = false;
    }
  }

  cancelEditImgSightseeing() {
    this.isDisplayNoneEditImgSightseeing = true;
    this.isDisplayNoneEditDefaultImgSightseeing = false;
    this.inputEditImgSightseeing.nativeElement.value = '';
    // this.showImgDefaultSightseeing = './assets/images/defaultHomestay.jpg';
    this.imgEditSightseeing = './assets/images/defaultHomestay.jpg';
    this.imgNotChange = true;
  }

  addSightseeing() {
    let data = {
      destinationName: (<HTMLInputElement>document.getElementById('addDestination')).value,
      description: this.addDescription,
      destinationPhoto: 'des' + (<HTMLSelectElement>document.getElementById('addDestination')).value + '.jpg',
      district: this.newDistrict,
      status: (<HTMLSelectElement>document.querySelector('input[name="newDestinationStatus"]:checked')).value
    }
    if ( this.validAddImg(this.imgAddSightseeing)
      && this.validAddDestination(data.destinationName)
      && this.validAddDescription(data.description)
    ) {
      this.destinationService.create(data).subscribe(
        res => {
          this.uploadService.deleteFile('des' + (<HTMLInputElement>document.getElementById('addDestination')).value).subscribe(
            res => {
              this.upload('des' + (<HTMLInputElement>document.getElementById('addDestination')).value + '.jpg');
              (function ($) {
                $("#addSightseeing").attr('data-dismiss', 'modal');
              })(jQuery);
              this.showToastMessage('Thêm thành công', 'success');
            }
          );
        },
        err => {
          console.log(err);
        }
      );
    }

  }

  saveUpdateDisctrict(event: any): void {
    this.districtService.get(event.target.value).subscribe(
      data => {
        this.currentDestination.district = data;
        console.log(this.currentDestination);
      },
      error => {
        console.log(error);
      }
    );
  }

  editSightseeing() {
    let data = {
      id: this.currentDestination.id,
      destinationName: (<HTMLInputElement>document.getElementById('updateName')).value,
      description: (<HTMLInputElement>document.getElementById('updateDescription')).value,
      district: this.currentDestination.district,
      destinationPhoto: 'des' + (<HTMLSelectElement>document.getElementById('updateName')).value + '.jpg',
      status: (<HTMLSelectElement>document.querySelector('input[name="editDestinationStatus"]:checked')).value
    }
    if (this.validEditImg(this.imgEditSightseeing)
      && this.validEditDestination(data.destinationName)
      && this.validEditDescription(data.description)
    ) {
      this.destinationService.update(data).subscribe(
        res => {
          if(!this.imgNotChange){
            this.uploadService.deleteFile('des' + (<HTMLInputElement>document.getElementById('updateName')).value).subscribe(
              res => {
                this.upload('des' + (<HTMLInputElement>document.getElementById('updateName')).value + '.jpg');
              }
            );
          }
          (function ($) {
            $("#editSightseeing").attr('data-dismiss', 'modal');
          })(jQuery);
          this.showToastMessage('Chỉnh sửa thành công', 'success');
        },
        error => {
          //console.log(error);
          this.showToastMessage(error, 'error');
        }
      );

    }
  }

  sightseeingIsActive(destination: any) {
    if (destination.status == 1) {
      this.messQuestion = 'Bạn có chắc muốn ẩn địa danh này không ?';
      this.messQuestionType = 'inActiveSightseeing';
    } else if (destination.status == 0) {
      this.messQuestion = 'Bạn có chắc muốn hiện địa danh này không ?';
      this.messQuestionType = 'activeSightseeing';
    }
    this.currentDestination = destination;
  }

  clickYES(id: any) {
    if (this.messQuestionType == 'inActiveSightseeing') {
      this.destinationService.changeStatus(0, id).subscribe(
        res => {
          this.showToastMessage('Ẩn địa danh thành công', 'success');
        },
        error => {
          //console.log(error);
          this.showToastMessage(error, 'error');
        }
      );

    } else if (this.messQuestionType == 'activeSightseeing') {
      this.destinationService.changeStatus(1, id).subscribe(
        res => {
          this.showToastMessage('Hiện địa danh thành công', 'success');
        },
        error => {
          //console.log(error);
          this.showToastMessage(error, 'error');
        }
      );
    }
  }

  private validAddImg(imgThumb: string) {
    let isValid = false;
    if (imgThumb == null || imgThumb.length == 0 || imgThumb == './assets/images/defaultHomestay.jpg') {
      this.messAddImgSightseeing = '*Không được để trống';
      isValid = false;
    } else {
      this.messAddImgSightseeing = '';
      imgThumb = imgThumb.replace(/\s\s+/g, ' ');
      isValid = true;
    }
    return isValid;
  }

  private validEditImg(imgThumb: string) {
    let isValid = false;
    if (imgThumb == null || imgThumb.length == 0 || imgThumb == './assets/images/defaultHomestay.jpg') {
      this.messEditImgSightseeing = '*Không được để trống';
      isValid = false;
    } else {
      this.messEditImgSightseeing = '';
      imgThumb = imgThumb.replace(/\s\s+/g, ' ');
      isValid = true;
    }
    return isValid;
  }

  private validAddDestination(name: string) {
    let isValid = false;
    if (name == null || name.length == 0) {
      this.messAddDestination = '*Không được để trống';
      isValid = false;
    } else {
      this.messAddDestination = '';
      name = name.replace(/\s\s+/g, ' ');
      isValid = true;
    }
    return isValid;
  }

  private validEditDestination(name: string) {
    let isValid = false;
    if (name == null || name.length == 0) {
      this.messEditDestination = '*Không được để trống';
      isValid = false;
    } else {
      this.messEditDestination = '';
      name = name.replace(/\s\s+/g, ' ');
      isValid = true;
    }
    return isValid;
  }

  private validAddDescription(name: string) {
    let isValid = false;
    if (name == null || name.length == 0) {
      this.messAddDescription = '*Không được để trống';
      isValid = false;
    } else {
      this.messAddDescription = '';
      name = name.replace(/\s\s+/g, ' ');
      isValid = true;
    }
    return isValid;
  }

  private validEditDescription(name: string) {
    let isValid = false;
    if (name == null || name.length == 0) {
      this.messEditDescription = '*Không được để trống';
      isValid = false;
    } else {
      this.messEditDescription = '';
      name = name.replace(/\s\s+/g, ' ');
      isValid = true;
    }
    return isValid;
  }

}
