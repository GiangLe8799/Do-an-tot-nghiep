import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ForgortPassService } from '../Services/forgort-pass.service';
import { UserService } from '../Services/user.service';

@Component({
  selector: 'app-recover-pass',
  templateUrl: './recover-pass.component.html',
  styleUrls: ['./recover-pass.component.scss']
})
export class RecoverPassComponent implements OnInit {

  recoverPassForm = this.formBuilder.group({
    newPass: [''],
    confirmNewPass: ['']
  });
  messNewPass!: string;
  messConfirmNewPass!: string;

  /* Toast message */
  displaySuccessMess: boolean = false;
  displayErrorMess: boolean = false;
  mess: string = '';

  token: string = '';

  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService,
    private activatedRoute: ActivatedRoute, private forgotService: ForgortPassService) {

  }

  ngOnInit(): void {
    document.body.scrollTop = 0;// For Safari
    document.documentElement.scrollTop = 0;// For Chrome, Firefox, IE and Opera
    this.activatedRoute.queryParams.subscribe(params => {
      this.token = params['token'];
      console.log(this.token);
    });
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

  public submitRecoverPass() {
    let newPass = this.recoverPassForm.controls.newPass.value;
    let confirmNewPass = this.recoverPassForm.controls.confirmNewPass.value;

    if (this.validNewPass(newPass) &&
      this.validConfirmNewPass(confirmNewPass, newPass)) {
      this.forgotService.findUserIdByToken(this.token)
        .subscribe(
          data => {
            this.userService.updatePass(data, newPass)
              .subscribe(
                response => {
                  this.showToastMessage('Kh??i ph???c m???t kh???u th??nh c??ng', 'success');
                  setTimeout(() => {
                    this.router.navigate(['/auth', 'login']);
                  }, 3000);
                },
                err => {
                  console.log(err);
                }
              );
          }
        );

    }
  }

  public validNewPass(newPass: string) {
    let isValid = false;
    if (newPass == null || newPass.length == 0) {
      this.messNewPass = 'kh??ng ???????c ????? tr???ng';
    } else {
      if (newPass.length < 6) {
        this.messNewPass = 'm???t kh???u t???i thi???u 6 k?? t???';
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
      this.messConfirmNewPass = 'kh??ng ???????c ????? tr???ng';
    } else {
      if (conNewPass.length < 6) {
        this.messConfirmNewPass = 'm???t kh???u t???i thi???u 6 k?? t???';
      } else if (conNewPass !== newPass) {
        this.messConfirmNewPass = 'kh??ng tr??ng m???t kh???u m???i';
      } else {
        this.messConfirmNewPass = '';
        isValid = true;
      }
    }
    return isValid;
  }
}
