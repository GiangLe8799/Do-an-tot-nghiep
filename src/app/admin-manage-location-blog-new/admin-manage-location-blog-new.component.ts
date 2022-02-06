import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Quill } from 'quill';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill';
import { TokenStorageService } from '../Services/token-storage.service';
import { SettingService } from '../Services/setting.service';
import { BlogService } from '../Services/blog.service';
import { Router } from '@angular/router';
import { ProvinceService } from '../Services/province.service';
import { DistrictService } from '../Services/district.service';
import { DestinationService } from '../Services/destination.service';
import { FileUploadService } from '../Services/file-upload.service';
import { Setting } from '../models/setting.model';
import { Observable } from 'rxjs';
import { Blog } from '../models/blog.model';
import { Province } from '../models/province.model';
import { District } from '../models/district.model';
import { Destination } from '../models/destination.model';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { User } from '../models/user.model';
import { UserService } from '../Services/user.service';

@Component({
  selector: 'app-admin-manage-location-blog-new',
  templateUrl: './admin-manage-location-blog-new.component.html',
  styleUrls: ['./admin-manage-location-blog-new.component.scss']
})
export class AdminManageLocationBlogNewComponent implements OnInit {
  imgThumbnail: string = "./assets/images/defaultHomestay.jpg";
  imgThumbBlog: string = '';
  messImgThumbBlog: string = '';
  messImgsBlogList: string = '';
  @ViewChild('inputImgThumb') inputImgThumb!: ElementRef;
  isDisplayNoneImgThumb: boolean = true;
  isDisplayNoneAddImgThumb: boolean = false;

  longDesc: string = '';
  checkLongDesc: string = '';

  messNameBlog: string = '';
  messShortDescBlog: string = '';
  messLongDescBlog: string = '';

  /* Toast message */
  displaySuccessMess: boolean = false;
  displayErrorMess: boolean = false;
  mess: string = '';

  categories: Setting[] = [];

  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  fileInfos?: Observable<any>;

  currentUser: User = {};
  blog: Blog = {};
  provinces: Province[] = [];
  districts: District[] = [];
  destinations: Destination[] = [];
  newDestination: Destination = {};

  constructor(private token: TokenStorageService, private blogService: BlogService,
    private router: Router, private provinceService: ProvinceService, private settingService: SettingService,
    private districtService: DistrictService, private destinationService: DestinationService,
    private uploadService: FileUploadService, private userService: UserService) {
  }

  ngOnInit(): void {
    document.body.scrollTop = 0;// For Safari
    document.documentElement.scrollTop = 0;// For Chrome, Firefox, IE and Opera
    if(this.token.getToken()){
      this.getCurrentUser(this.token.getUser().id);
    }
    this.getAllProvinces();
    this.getCategorySetting();
  }

  getCurrentUser(id: any): void{
    this.userService.get(id).subscribe(
      res => {
        this.currentUser = res;
      }, error => {
        console.log(error);
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

  getCategorySetting(): void {
    this.settingService.getByType('CATEGORY').subscribe(
      res => {
        this.categories = res;
      }
    );
  }

  showCategoryText(category: any): any {
    let text = '';
    this.categories.forEach(c => {
      if (c.value == category) {
        text = c.name!;
      }
    });
    return text;
  }

  getAllProvinces(): void {
    this.provinceService.getAll().subscribe(
      res => {
        this.provinces = res;
        this.getDistrictsByProvince(this.provinces[0].id);

      }
    );
  }

  getDistrictsByProvince(provinceId: any): void {
    this.districtService.getByProvince(provinceId)
      .subscribe(
        data => {
          this.districts = data;
          this.getDestinationsByDistrict(this.districts[0].id);
        },
        error => {
          this.districts = [];
          console.log(error);
        }
      );
  }

  getDestinationsByDistrict(districtId: any): void {
    this.destinationService.getByDistrict(districtId).subscribe(
      res => {
        this.destinations = res;
        this.newDestination = this.destinations[0];
      },
      error => {
        this.destinations = [];
        this.newDestination = {};
        console.log(error);
      }
    );
  }

  changeCity(event: any): void {
    this.districtService.getByProvince(event.target.value)
      .subscribe(
        data => {
          this.districts = data;
          this.getDestinationsByDistrict(this.districts[0].id);
        },
        error => {
          this.districts = [];
          this.destinations = [];
          this.newDestination = {};
          console.log(error);
        }
      );
  }

  changeDistrict(event: any): void {
    this.getDestinationsByDistrict(event.target.value);
  }

  changeDestination(event: any): void {
    this.destinationService.get(event.target.value).subscribe(
      res => {
        this.newDestination = res;
      }, error => {
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

  submitAddBlog() {
    let data = {
      postName: (<HTMLInputElement>document.getElementById('nameBlog')).value,
      shortDescription: (<HTMLInputElement>document.getElementById('shortDesc')).value,
      category: (<HTMLInputElement>document.getElementById('typeBlog')).value,
      destination: this.newDestination,
      user: this.currentUser,
      content: this.longDesc,
      status: (<HTMLSelectElement>document.querySelector('input[name="newStatus"]:checked')).value
    }

    if (
      this.validImgThumb(this.imgThumbBlog)
      && this.validNameBlog(data.postName)
      && this.validShortDesc(data.shortDescription)
      && this.validLongDesc(this.checkLongDesc)
    ) {
      this.blogService.create(data).subscribe(
        res => {
          this.upload('post'+res.id+ '.jpg');
          this.showToastMessage('Tạo blog mới thành công', 'success');
        }, err =>{
          console.log(err);
        }
      );

    }
  }

  onSelectImageThumb(e: any) {
    this.selectedFiles = e.target.files;
    if (e.target.files && e.target.value.length != 0) {
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.imgThumbBlog = event.target.result;
      }
      reader.readAsDataURL(e.target.files[0]);
      this.isDisplayNoneImgThumb = false;
      this.isDisplayNoneAddImgThumb = true;
      this.messImgThumbBlog = '';
    }
  }

  cancelAddImgThumb() {
    this.isDisplayNoneImgThumb = true;
    this.isDisplayNoneAddImgThumb = false;
    this.inputImgThumb.nativeElement.value = '';
    this.imgThumbBlog = './assets/images/defaultHomestay.jpg';
    this.messImgThumbBlog = '';
  }

  changedEditor(event: EditorChangeContent | EditorChangeSelection) {
    this.longDesc = event.editor.root.innerHTML;
    this.checkLongDesc = event.editor.root.innerText;
  }

  private validImgThumb(imgThumb: string) {
    let isValid = false;
    if (imgThumb == null || imgThumb.length == 0) {
      this.messImgThumbBlog = '*Không được để trống';
      isValid = false;
    } else {
      this.messImgThumbBlog = '';
      imgThumb = imgThumb.replace(/\s\s+/g, ' ');
      isValid = true;
    }
    return isValid;
  }

  private validNameBlog(name: string) {
    let isValid = false;
    if (name == null || name.length == 0) {
      this.messNameBlog = '*Không được để trống';
      isValid = false;
    } else if (name.length > 1000) {
      this.messNameBlog = '*Không được dài quá 1000 từ';
      isValid = false;
    } else {
      this.messNameBlog = '';
      name = name.replace(/\s\s+/g, ' ');
      isValid = true;
    }
    return isValid;
  }

  private validShortDesc(name: string) {
    let isValid = false;
    if (name == null || name.length == 0) {
      this.messShortDescBlog = '*Không được để trống';
      isValid = false;
    } else if (name.length > 1000) {
      this.messShortDescBlog = '*Không được dài quá 1000 từ';
      isValid = false;
    } else {
      this.messShortDescBlog = '';
      name = name.replace(/\s\s+/g, ' ');
      isValid = true;
    }
    return isValid;
  }

  private validLongDesc(name: string) {
    let isValid = false;
    if (name == null || name.length == 0) {
      this.messLongDescBlog = '*Không được để trống';
      isValid = false;
    } else if (name.length > 5000) {
      this.messLongDescBlog = '*Không được dài quá 5000 từ';
      isValid = false;
    } else {
      this.messLongDescBlog = '';
      name = name.replace(/\s\s+/g, ' ');
      isValid = true;
    }
    return isValid;
  }

}
