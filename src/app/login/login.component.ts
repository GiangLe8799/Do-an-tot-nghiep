import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { TokenStorageService } from '../Services/token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginImg: string = "assets/images/loginImage.jpg";
  tick: string = "assets/images/tick.png";
  message: string = "Đăng nhập thành công!";

  messUsername:string = '';
  messPass:string = '';

  form: any = {
    userName: null,
    passWord: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  constructor(private authService: AuthService, private tokenStorage: TokenStorageService,
    private router: Router) { }

  ngOnInit(): void {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
    }
    this.getUserInfo();
  }

  rememberInfo(event: any): void{
    if(event.target.checked){
      const userData = {
        userName: this.form.userName,
        passWord: this.form.passWord
      }
      window.localStorage.setItem('user-login',JSON.stringify(userData));
    }
    else{
      window.localStorage.removeItem('user-login');
    }
  }

  getUserInfo(): void{
    const data = window.localStorage.getItem('user-login');
    if(data){
      this.form = JSON.parse(data);
    }
  }

  onSubmit(): void {
    const { userName, passWord } = this.form;
    if(this.validName(this.form.userName)
      // && this.validPass(this.form.passWord)
    ) {
      this.authService.login(userName, passWord).subscribe(
        data => {
          window.sessionStorage.clear();
          this.tokenStorage.saveToken(data.accessToken);
          this.tokenStorage.saveUser(data);
          this.isLoginFailed = false;
          this.isLoggedIn = true;
          this.router.navigate(['home']).then(() => {window.location.reload()});
        },
        err => {
          this.isLoginFailed = true;
          if(err.error.message.length > 0) {
            this.errorMessage = err.error.message;
          }
          else{
            this.errorMessage = 'Sai tên đăng nhập hoặc mật khẩu';
          }
        }
      );
    }
  }

  private validName(name: string) {
    let isValid = false;
    if (name == null || name.length == 0) {
      this.messUsername = '*Không được để trống';
      isValid = false;
    } else {
      this.messUsername = '';
      isValid = true;
    }
    return isValid;
  }

}
