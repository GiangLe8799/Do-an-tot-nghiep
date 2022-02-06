import { formatDate } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { base64ToFile, ImageCroppedEvent } from 'ngx-image-cropper';
import { CompressImageService } from '../Services/compress-image.service';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { UserService } from '../Services/user.service';
import { TokenStorageService } from '../Services/token-storage.service';
import { Observable } from 'rxjs';
import { FileUploadService } from '../Services/file-upload.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  public imgAva: string = '/assets/images/defaultAva.jpg';
  public isDisplayModalChangeAva: boolean = false;
  private imgCropped!: File;
  public imageChangedEvent!: any;
  private croppedImage!: any;
  public imgCroppedCompress!: File;
  public time: Date = new Date();
  public year: string = formatDate(this.time, 'yyyy', 'en-US');
  public month: string = formatDate(this.time, 'MM', 'en-US');
  public day: string = formatDate(this.time, 'dd', 'en-US');

  editProfileForm = this.formBuilder.group({
    fullname: [''],
    dob: [''],
    phone: [''],
    email: [''],
  });
  public messName!: string;
  public messDOB!: string;
  public messPhone!: string;
  public messEmail!: string;

  /* Toast message */
  displaySuccessMess: boolean = false;
  displayErrorMess: boolean = false;
  mess: string = '';

  user: User = {};

  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';

  fileInfos?: Observable<any>;

  @ViewChild('fileInput') fileInput!: ElementRef;
  constructor(private formBuilder: FormBuilder, private router: Router, private compressImg: CompressImageService,
    private token: TokenStorageService, private userService: UserService, private uploadService: FileUploadService) { }

  ngOnInit(): void {
    document.body.scrollTop = 0;// For Safari
    document.documentElement.scrollTop = 0;// For Chrome, Firefox, IE and Opera
    (<HTMLInputElement>document.getElementById("fullname")).addEventListener("input", this.forceLower);
    if (this.token.getToken()) {
      this.getCurrentUser(this.token.getUser().username);
    }
    this.uploadService.getFiles().subscribe(
      data => {
        this.fileInfos = data;
        this.fileInfos!.forEach(element => {
          if (element.name == 'avatar' + this.user.id + '.jpg') {
            this.imgAva = element.url;
          }
        });
      }
    );
    window.sessionStorage.removeItem("search-key");
  }

  getCurrentUser(name: string): void {
    this.userService.getByUsername(name)
      .subscribe(
        data => {
          this.user = data;
          this.user.dob = this.formatDob(this.user.dob);
        },
        error => {
          //console.log(error);
          this.showToastMessage(error, 'error');
        }
      );
  }

  formatDob(date: any): any {
    return formatDate(date, 'yyyy-MM-dd', 'en-US');
  }

  updateUserInfo(): void {
    const data = {
      id: this.user.id,
      userName: this.user.userName,
      fullName: this.user.fullName,
      dob: this.user.dob,
      phoneNumber: this.user.phoneNumber,
      email: this.user.email,
      role: this.user.role,
      userPhoto: 'avatar' + this.user.id
    }
    this.userService.updateUser(data)
      .subscribe(
        response => {
          if (response != null) {
            this.showToastMessage('Cập nhật hồ sơ thành công', 'success');
          }
          else {
            this.showToastMessage('Cập nhật thông tin cá nhân thất bại! Email đã đc sử dụng', 'error');
          }
        },
        err => {
          this.showToastMessage(err.error.message, 'error');
        }
      );
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  upload(): void {
    console.log(this.selectedFiles);
    this.progress = 0;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.uploadService.deleteFile('avatar' + this.user.id).subscribe(
          res => {
            this.currentFile = new File([file], 'avatar' + this.user.id + '.jpg', { type: 'image/jpg' });
            // this.currentFile = file;

            this.uploadService.upload(this.currentFile).subscribe(
              (event: any) => {
                if (event.type === HttpEventType.UploadProgress) {
                  this.progress = Math.round(100 * event.loaded / event.total);
                } else if (event instanceof HttpResponse) {
                  this.message = event.body.message;
                  this.fileInfos = this.uploadService.getFiles();
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
          });
      }

      this.selectedFiles = undefined;
    }
  }

  showToastMessage(message: string, typeMess: string) {
    if (typeMess == 'success') {
      this.displaySuccessMess = true;
      this.mess = message;
      setTimeout(() => {
        this.displaySuccessMess = false;
        window.location.reload();
        this.mess = '';
      }, 2000);
    } else if (typeMess == 'error') {
      this.displayErrorMess = true;
      this.mess = message;
      setTimeout(() => {
        this.displayErrorMess = false;
        window.location.reload();
        this.mess = '';
      }, 4000);
    }
  }

  toHost(): void{
    this.userService.changeRoleUser(this.user,'ROLE_BE_HOST').subscribe(
      res => {
        this.showToastMessage('Gửi yêu cầu thành công! Xin vui lòng chờ Admin duyệt','success');
      }, err => {

      }
    );
  }

  submitProfile() {
    let name = this.editProfileForm.controls.fullname.value;
    let dob = this.editProfileForm.controls.dob.value;
    let phone = this.editProfileForm.controls.phone.value;
    let email = this.editProfileForm.controls.email.value;
    if (this.validName(name) &&
      this.validDOB(dob) &&
      this.validPhone(phone) &&
      this.validEmail(email)
    ) {
      this.updateUserInfo();

    }
  }

  closeModalChangeAva() {
    this.isDisplayModalChangeAva = false;
    this.fileInput.nativeElement.value = "";
    this.imgAva = '';
  }

  fileChangeEvent(event: any) {
    this.imageChangedEvent = event;
    this.selectFile(this.imageChangedEvent);
    if (event.target.value.length === 0) {
      this.isDisplayModalChangeAva = false;
    } else {
      this.isDisplayModalChangeAva = true;
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.imgCropped = new File([base64ToFile(this.croppedImage)], 'Cropped_' + this.imageChangedEvent.target.files[0].name, { type: 'image/jpg' });
  }

  uploadFile() {
    this.upload();
    // this.compressImg.compress(this.imgCropped)
    //   .pipe(take(1)).subscribe(compressedImg => {
    //     this.imgCroppedCompress = compressedImg;
    //     //upload img here
    //   });
    this.closeModalChangeAva();
    this.showToastMessage('Cập nhật ảnh đại diện thành công', 'success');
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
    if (name == null || name.length == 0) {
      this.messName = 'Không được để trống';
      isValid = false;
    } else {
      if (this.isNOTName(name) == true) {
        this.messName = 'Tên không được có số hoặc kí tự đặc biệt';
        isValid = false;
      } else {
        this.messName = '';
        name = name.replace(/\s\s+/g, ' ');
        isValid = true;
      }
    }
    return isValid;
  }

  private validDOB(dob: string) {
    let isValid = false;
    let today = new Date(formatDate(this.time, 'yyyy/MM/dd', 'en-US'));
    if (dob == null || dob.length == 0) {
      this.messDOB = 'Ngày sinh điền không đầy đủ';
      isValid = false
    } else {
      let dobirth = new Date(formatDate(dob, 'yyyy/MM/dd', 'en-US'));
      if (dobirth.getTime() >= today.getTime()) {
        this.messDOB = 'Ngày sinh không hợp lệ';
        isValid = false
      } else {
        this.messDOB = '';
        isValid = true;
      }
    }
    return isValid;
  }

  private isCorrectPhone(phone: string) {
    let regex = /^[0-9]{1,4}[0-9]{1,3}[0-9]{1,4}$/g;
    let result = regex.test(phone);
    return result;
  }
  private validPhone(tel: string) {
    tel = tel.replace(/\s+/g, '');
    let isValid = false;
    if (tel == null || tel.length == 0) {
      this.messPhone = 'Không được để trống';
      isValid = false;
    } else {
      if (this.isCorrectPhone(tel) == false) {
        this.messPhone = 'Số điện thoại không đúng định dạng';
        isValid = false;
      } else if (tel.length < 10) {
        this.messPhone = 'Số điện thoại ít nhất là 10 số';
        isValid = false;
      } else {
        this.messPhone = '';
        isValid = true;
      }
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
    if (email == null || email.length == 0) {
      this.messEmail = 'Không được để trống';
      isValid = false;
    } else {
      if (this.isCorrectEmail(email) == false) {
        this.messEmail = 'Email không đúng định dạng';
        isValid = false;
      } else if (email == 'abc@gmail.com') {
        this.messEmail = 'Email này đã tồn tại';
        isValid = false;
      } else {
        this.messEmail = '';
        isValid = true;
      }
    }
    return isValid;
  }
}
