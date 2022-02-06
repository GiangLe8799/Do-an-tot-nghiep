import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { TokenStorageService } from '../Services/token-storage.service';
import { UserService } from '../Services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm = this.formBuilder.group({
    email: [''],
    phone: [''],
    fullname: [''],
    //username: [''],
    password: [''],
    confirmPassword: ['']
  });
  messEmail!: string;
  messPhone!: string;
  messName!: string;
  messUserName!: string;
  messPass!: string;
  messConfirmPass!: string;

  /* Toast message */
  displaySuccessMess:boolean = false;
  displayErrorMess:boolean = false;
  mess:string='';

  public formRegister: any = {
    userName: '',
    phoneNumber: '',
    email: '',
    fullName: '',
    passWord: '',
    confirmPass: ''
  };

  constructor(private formBuilder: FormBuilder, private userService: UserService,
    private router: Router, private token: TokenStorageService, private authService: AuthService) { }

  ngOnInit(): void {
    document.body.scrollTop = 0;// For Safari
    document.documentElement.scrollTop = 0;// For Chrome, Firefox, IE and Opera
    (<HTMLInputElement>document.getElementById("fullname")).addEventListener("input", this.forceLower);
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

  register(): void {
    this.formRegister.userName = this.formRegister.phoneNumber;
    const data = {
      userName: this.formRegister.userName,
      passWord: this.formRegister.passWord,
      fullName: this.formRegister.fullName,
      phoneNumber: this.formRegister.phoneNumber,
      email: this.formRegister.email,
      status: 1,
      role: 'ROLE_CUSTOMER'
    }
    console.log(data);
    //đki và lưu vào db
    this.authService.register(data)
      .subscribe(
        data => {
          this.showToastMessage('Đăng ký thành công', 'success');
          setTimeout(() => {
            this.router.navigate(['/auth', 'login']);
          }, 2000);
        },
        error => {
          this.showToastMessage(error.error.message, 'error');
          console.log(error.error.message);
        }
      );
  }

  submitRegister() {
    let email = this.registerForm.controls.email.value;
    let phone = this.registerForm.controls.phone.value;
    let name = this.registerForm.controls.fullname.value;
    //let username = this.registerForm.controls.username.value;
    let pass = this.registerForm.controls.password.value;
    let confirmPass = this.registerForm.controls.confirmPassword.value;

    if (this.validEmail(email) &&
      this.validPhone(phone) &&
      this.validName(name) &&
      //this.validUserName(username) &&
      this.validPass(pass) &&
      this.validConfirmPass(pass, confirmPass)) {
        this.register();
    }
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

  private isCorrectEmail(email: string) {
    let regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    let result = regex.test(email);
    return result;
  }

  private validEmail(email: string) {
    let isValid = false;
    if (email == null || email.length == 0) {
      this.messEmail = '*Không được để trống';
      isValid = false;
    } else {
      if (this.isCorrectEmail(email) == false) {
        this.messEmail = '*Email không đúng định dạng';
        isValid = false;
      } else {
        this.messEmail = '';
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

  private validPhone(phone: string) {
    let isValid = false;
    if (phone == null || phone.length == 0) {
      this.messPhone = '*Không được để trống';
      isValid = false;
    } else {
      if (this.isCorrectPhone(phone) == false) {
        this.messPhone = '*Số điện thoại không đúng định dạng';
        isValid = false;
      } else if (phone.length < 10 || phone.length > 11) {
        this.messPhone = '*Số điện thoại không hợp lệ';
        isValid = false;
      } else {
        this.messPhone = '';
        isValid = true;
      }
    }
    return isValid;
  }

  private isNOTName(name: string) {
    let regex = /[0-9*|\":<>[\]{}`\\()';@&$!#%^+/,.?~\-]/g;
    let result = regex.test(name);
    return result;
  }

  private validName(name: string) {
    let isValid = false;
    if (name == null || name.length == 0) {
      this.messName = '*Không được để trống';
      isValid = false;
    } else {
      if (this.isNOTName(name) == true) {
        this.messName = '*Tên không được có số hoặc kí tự đặc biệt';
        isValid = false;
      } else {
        this.messName = '';
        name = name.replace(/\s\s+/g, ' ');
        isValid = true;
      }
    }
    return isValid;
  }

  private isNOTUserName(name: string) {
    let regex = /[*|\":<>[\]{}`\\()';@&$!#%^+/,.?~\-]/g;
    let result = regex.test(name);
    return result;
  }

  private validUserName(name: string) {
    let isValid = false;
    if (name == null || name.length == 0) {
      this.messName = '*Không được để trống';
      isValid = false;
    } else {
      if (this.isNOTUserName(name) == true) {
        this.messName = '*Không được kí tự đặc biệt';
        isValid = false;
      } else {
        this.messName = '';
        name = name.replace(/\s\s+/g, ' ');
        isValid = true;
      }
    }
    return isValid;
  }

  public validPass(pass: string) {
    let isValid = false;
    if (pass == null || pass.length == 0) {
      this.messPass = 'không được để trống';
    } else {
      if (pass.length < 8) {
        this.messPass = 'mật khẩu tối thiểu 8 kí tự';
      } else {
        this.messPass = '';
        isValid = true;
      }
    }
    return isValid;
  }
  public validConfirmPass(confirmPass: string, pass: string) {
    let isValid = false;
    if (confirmPass == null || confirmPass.length == 0) {
      this.messConfirmPass = 'không được để trống';
    } else {
      if (confirmPass.length < 8) {
        this.messConfirmPass = 'mật khẩu tối thiểu 8 kí tự';
      } else if (confirmPass !== pass) {
        this.messConfirmPass = 'không trùng mật khẩu';
      } else {
        this.messConfirmPass = '';
        isValid = true;
      }
    }
    return isValid;
  }

}
