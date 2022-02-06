import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Quill } from 'quill';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill';
import { TokenStorageService } from '../Services/token-storage.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BlogService } from '../Services/blog.service';
import { Blog } from '../models/blog.model';
import { ProvinceService } from '../Services/province.service';
import { Province } from '../models/province.model';
import { DistrictService } from '../Services/district.service';
import { District } from '../models/district.model';
import { DestinationService } from '../Services/destination.service';
import { Destination } from '../models/destination.model';
import { SettingService } from '../Services/setting.service';
import { Setting } from '../models/setting.model';
import { FileUploadService } from '../Services/file-upload.service';
import { Observable } from 'rxjs';
import { HttpEventType, HttpResponse } from '@angular/common/http';
//import BlotFormatter from 'quill-blot-formatter';
//Quill.register('modules/blotFormatter', BlotFormatter);

@Component({
  selector: 'app-admin-manage-location-blog-detail',
  templateUrl: './admin-manage-location-blog-detail.component.html',
  styleUrls: ['./admin-manage-location-blog-detail.component.scss']
})
export class AdminManageLocationBlogDetailComponent implements OnInit {
  imgThumbBlog: string = './assets/images/defaultHomestay.jpg';
  messImgThumbBlog: string = '';
  messImgsBlogList: string = '';
  @ViewChild('inputImgThumb') inputImgThumb!: ElementRef;
  isDisplayNoneImgThumb: boolean = true;
  isDisplayNoneAddImgThumb: boolean = false;
  checkLongDesc: string = '';

  longDesc: string = '';

  messNameBlog: string = '';
  messShortDescBlog: string = '';
  messLongDescBlog: string = '';

  /* Toast message */
  displaySuccessMess: boolean = false;
  displayErrorMess: boolean = false;
  mess: string = '';

  blog: Blog = {};
  provinces: Province[] = [];
  districts: District[] = [];
  destinations: Destination[] = [];
  updateDestination: Destination = {};
  retrieveParams: Params = {
    currentBlogId: 0
  }
  categories: Setting[] = [];

  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  fileInfos?: Observable<any>;
  imgNotChange = false;

  constructor(private token: TokenStorageService, private route: ActivatedRoute, private router: Router,
    private blogService: BlogService, private provinceService: ProvinceService, private settingService: SettingService,
    private districtService: DistrictService, private destinationService: DestinationService,
    private uploadService: FileUploadService) {
  }

  ngOnInit(): void {
    document.body.scrollTop = 0;// For Safari
    document.documentElement.scrollTop = 0;// For Chrome, Firefox, IE and Opera
    this.route.queryParams.subscribe(params => {
      this.retrieveParams = params;
      this.getBlogById(this.retrieveParams.currentBlogId);
    });
    this.getCategorySetting();
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
        this.getDistrictsByProvince(this.blog.destination?.district?.province?.id);
        this.getDestinationsByDistrict(this.blog.destination?.district?.id);
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
          this.districts = [];
          console.log(error);
        }
      );
  }

  getDestinationsByDistrict(districtId: any): void {
    this.destinationService.getByDistrict(districtId).subscribe(
      res => {
        this.destinations = res;
        this.updateDestination = this.destinations[0];
      },
      error => {
        this.destinations = [];
        this.updateDestination = {};
        console.log(error);
      }
    );
  }

  getBlogById(id: any): void {
    this.blogService.get(id).subscribe(
      res => {
        this.blog = res;
        this.updateDestination = this.blog.destination!;
        this.getAllProvinces();
        this.uploadService.getFiles().subscribe(
          data => {
            this.fileInfos = data;
            this.fileInfos!.forEach(element => {
              if (element.name == 'post' + this.blog.id + '.jpg') {
                this.imgThumbBlog = element.url;
                this.imgNotChange = true;
              }
            });
            this.isDisplayNoneImgThumb = false;
            this.isDisplayNoneAddImgThumb = true;
          }
        );
      }, err => {
        console.log(err);
      }
    );
  }

  changeCity(event: any): void {
    this.districtService.getByProvince(event.target.value)
      .subscribe(
        data => {
          this.districts = data;
          this.getDestinationsByDistrict(this.districts[0].id);
          this.showToastMessage('Cập nhật thành công', 'success');
        },
        error => {
          this.districts = [];
          this.destinations = [];
          this.updateDestination = {};
          this.showToastMessage(error, 'error');
          //console.log(error);
        }
      );
  }

  changeDistrict(event: any): void {
    this.getDestinationsByDistrict(event.target.value);
  }

  changeDestination(event: any): void {
    this.destinationService.get(event.target.value).subscribe(
      res => {
        this.updateDestination = res;
        this.showToastMessage('Cập nhật thành công', 'success');
      }, error => {
        this.showToastMessage(error, 'error');
        //console.log(error);
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

  submitEditBlog() {
    let data = {
      id: this.blog.id,
      postName: (<HTMLInputElement>document.getElementById('nameBlog')).value,
      shortDescription: (<HTMLInputElement>document.getElementById('shortDesc')).value,
      category: (<HTMLInputElement>document.getElementById('typeBlog')).value,
      destination: this.updateDestination,
      user: this.blog.user,
      content: this.blog.content,
      date: this.blog.date,
      postPhoto: this.blog.postPhoto,
      status: (<HTMLSelectElement>document.querySelector('input[name="editStatus"]:checked')).value
    }
    console.log(data.content);
    if (
      this.validImgThumb(this.imgThumbBlog)
      &&
      this.validNameBlog(data.postName)
      && this.validShortDesc(data.shortDescription)
      && this.validLongDesc(this.checkLongDesc)
    ) {
      this.blogService.update(data).subscribe(
        res => {
          if (!this.imgNotChange) {
            this.uploadService.deleteFile('post' + data.id).subscribe(
              res => {
                this.upload(data.postPhoto!);
              }
            );
          }
          this.showToastMessage('Cập nhật thành công', 'success');
          this.router.navigate(['/admin/blog-list']);

        }, error => {
          //console.log(error);
          this.showToastMessage(error, 'error');
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
      this.imgNotChange = false;
    }
  }

  cancelAddImgThumb() {
    this.isDisplayNoneImgThumb = true;
    this.isDisplayNoneAddImgThumb = false;
    this.inputImgThumb.nativeElement.value = '';
    this.imgThumbBlog = './assets/images/defaultHomestay.jpg';
    this.imgNotChange = true;
  }

  changedEditor(event: any) {
    if(event){
      this.blog.content = event.editor.root.innerHTML;
      this.checkLongDesc = event.editor.root.innerText;
    }
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
      isValid = true;
    }
    return isValid;
  }
}
