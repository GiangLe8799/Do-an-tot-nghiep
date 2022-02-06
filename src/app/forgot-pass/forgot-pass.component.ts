import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ForgortPassService } from '../Services/forgort-pass.service';
import { UserService } from '../Services/user.service';

@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.component.html',
  styleUrls: ['./forgot-pass.component.scss']
})
export class ForgotPassComponent implements OnInit {

  forgotPassForm = this.formBuilder.group({
    email: ['']
  });
  messEmail!: string;

  /* Toast message */
  displaySuccessMess: boolean = false;
  displayErrorMess: boolean = false;
  mess: string = '';

  constructor(private formBuilder: FormBuilder, private router: Router,
    private userService: UserService, private forgortService: ForgortPassService) { }

  ngOnInit(): void {
    document.body.scrollTop = 0;// For Safari
    document.documentElement.scrollTop = 0;// For Chrome, Firefox, IE and Opera
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

  public sendLinkRecoverPassword() {
    let email = this.forgotPassForm.controls.email.value;
    if (this.validEmail(email)) {
      this.userService.findUserByEmail(email)
        .subscribe(
          data => {
            this.forgortService.createToken(data.id)
              .subscribe(
                response => {
                  // window.sessionStorage.setItem('reset-pass-token', )
                  this.showToastMessage('Đã gửi thành công', 'success');
                  // setTimeout(() => {
                  //   this.router.navigate(['/auth', 'login']);
                  // }, 2000);
                  (<HTMLInputElement>document.getElementById('email')).value = '';
                }
              );
          }, error => {
            this.showToastMessage('Không tìm thấy email trong hệ thống!', 'error');
            (<HTMLInputElement>document.getElementById('email')).value = '';
          }
        );

    }
  }

  private isCorrectEmail(email: string) {
    let regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    let result = regex.test(email);
    return result;
  }

  private validEmail(email: string) {
    let isValid = false;
    if (email == null || email.length == 0) {
      this.messEmail = 'không được để trống';
      isValid = false;
    } else {
      if (this.isCorrectEmail(email) == false) {
        this.messEmail = 'Email không đúng định dạng';
        isValid = false;
      } else if (email == 'abc@gmail.com') {
        this.messEmail = 'email này đã tồn tại';
        isValid = false;
      } else {
        this.messEmail = '';
        isValid = true;
      }
    }
    return isValid;
  }

}
