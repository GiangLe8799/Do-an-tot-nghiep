import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenStorageService } from '../Services/token-storage.service';
import { UserService } from '../Services/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  changePassForm = this.formBuilder.group({
    currentPass: [''],
    newPass: [''],
    confirmNewPass: ['']
  });

  messCurrentPass!: string;
  messNewPass!: string;
  messConfirmNewPass!: string;

  /* Toast message */
  displaySuccessMess:boolean = false;
  displayErrorMess:boolean = false;
  mess:string='';

  constructor(private formBuilder: FormBuilder, private router: Router,
    private userService: UserService, private token: TokenStorageService) { }

  ngOnInit(): void {
  }

  showToastMessage(message:string, typeMess: string) {
    if(typeMess == 'success') {
      this.displaySuccessMess = true;
      this.mess = message;
      setTimeout(()=>{
        this.displaySuccessMess = false;
        this.mess = '';
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

  updatePass(userId: any, newPass: string): void {
    this.userService.updatePass(userId, newPass)
      .subscribe(
        res => {
          this.showToastMessage('Đổi mật khẩu thành công', 'success');
          this.changePassForm.controls.currentPass.setValue('');
          this.changePassForm.controls.newPass.setValue('');
          this.changePassForm.controls.confirmNewPass.setValue('');
          setTimeout(() => {
            this.router.navigate(['profile/edit']);
          }, 2000);
        },
        error => {
          this.showToastMessage('Đổi mật khẩu thất bại' + error.message, 'error');
          this.changePassForm.controls.currentPass.setValue('');
          this.changePassForm.controls.newPass.setValue('');
          this.changePassForm.controls.confirmNewPass.setValue('');
        }
      );
  }

  submitChangePass() {
    this.checkPassAndUpdate();
  }

  public checkPassAndUpdate(): void {
    this.userService.isCorrectPass(this.token.getUser().id, this.changePassForm.controls.currentPass.value)
      .subscribe(
        (res) => {
          if (res) {
            this.messCurrentPass = '';
            let currentPass = this.changePassForm.controls.currentPass.value;
            let newPass = this.changePassForm.controls.newPass.value;
            let confirmNewPass = this.changePassForm.controls.confirmNewPass.value;
            if (this.validCurrentPass(currentPass) &&
              this.validNewPass(newPass, currentPass) &&
              this.validConfirmNewPass(confirmNewPass, newPass)
            ) {
              console.log('Hi');
              this.updatePass(this.token.getUser().id, newPass);
            }
          }
          else {
            this.messCurrentPass = 'sai mật khẩu';
          }
        },
        error => {
          //console.log(error);
          this.showToastMessage(error, 'error');
        }
      );
  }

  public validCurrentPass(curPass: string) {
    let isValid = false;
    if (curPass == null || curPass.length == 0) {
      this.messCurrentPass = 'không được để trống';
    } else {
      if (curPass.length < 6) {
        this.messCurrentPass = 'mật khẩu tối thiểu 6 kí tự';
      }
      else {
        isValid = true;
      }
    }
    console.log(isValid);
    return isValid;
  }
  public validNewPass(newPass: string, currentPass: string) {
    let isValid = false;
    if (newPass == null || newPass.length == 0) {
      this.messNewPass = 'không được để trống';
    } else {
      if (newPass.length < 6) {
        this.messNewPass = 'mật khẩu tối thiểu 6 kí tự';
      } else if (newPass == currentPass) {
        this.messNewPass = 'trùng mật khẩu hiện tại';
      } else {
        this.messNewPass = '';
        isValid = true;
      }
    }
    return isValid;
  }
  public validConfirmNewPass(conNewPass: string, newPass: string) {
    let isValid = false;
    if (conNewPass == null || conNewPass.length == 0) {
      this.messConfirmNewPass = 'không được để trống';
    } else {
      if (conNewPass.length < 6) {
        this.messConfirmNewPass = 'mật khẩu tối thiểu 6 kí tự';
      } else if (conNewPass !== newPass) {
        this.messConfirmNewPass = 'không trùng mật khẩu mới';
      } else {
        this.messConfirmNewPass = '';
        isValid = true;
      }
    }
    return isValid;
  }
}
