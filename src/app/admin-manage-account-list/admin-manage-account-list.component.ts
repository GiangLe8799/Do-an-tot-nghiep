import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Setting } from '../models/setting.model';
import { User } from '../models/user.model';
import { AuthService } from '../Services/auth.service';
import { SettingService } from '../Services/setting.service';
import { TokenStorageService } from '../Services/token-storage.service';
import { UserService } from '../Services/user.service';
declare var jQuery: any;
@Component({
  selector: 'app-admin-manage-account-list',
  templateUrl: './admin-manage-account-list.component.html',
  styleUrls: ['./admin-manage-account-list.component.scss']
})
export class AdminManageAccountListComponent implements OnInit {
  listAccount: any;
  totalLengthAcc: any;
  page: number = 1;
  mesError: string = "";
  note: string = "Tài khoản của admin!";
  roleUser: string = '';
  users: User[] = [];
  currUser: User = {};
  searchKey: string = '';

  messAddUserName!: string;
  messAddName!: string;
  messAddPhone!: string;
  messAddEmail!: string;

  messEditName!: string;
  messEditPhone!: string;
  messEditEmail!: string;

  /* Message question */
  messQuestion: string = '';
  messQuestionType: string = '';

  /* Toast message */
  displaySuccessMess: boolean = false;
  displayErrorMess: boolean = false;
  mess: string = '';
  userRoles: Setting[] = [];

  countAll = 0;
  countActive = 0;
  countDisabled = 0;

  constructor(private router: Router, private auth: AuthService,
    private userService: UserService, private token: TokenStorageService, private settingService: SettingService) { }

  ngOnInit(): void {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    // window.sessionStorage.removeItem('ACC_LIST');
    this.getAllAccount();
    this.getRoleSetting();
  }

  getUserById(id: any): void {
    this.userService.get(id)
      .subscribe(
        data => {
          this.currUser = data;
        },
        error => {
          console.log(error);
        }
      );
  }

  getRoleSetting(): void {
    this.settingService.getByType('ROLE').subscribe(
      res => {
        this.userRoles = res;
      }
    );
  }

  showRoleText(role: any): any {
    let text = '';
    this.userRoles.forEach(r => {
      if(r.value == role){
        text = r.name!;
      }
    });
    return text;
  }

  showToastMessage(message: string, typeMess: string) {
    if (typeMess == 'success') {
      this.displaySuccessMess = true;
      this.mess = message;
      setTimeout(() => {
        window.location.reload();
        this.displaySuccessMess = false;
        this.mess = '';
      }, 2000);
    } else if (typeMess == 'error') {
      this.displayErrorMess = true;
      this.mess = message;
      setTimeout(() => {
        this.displayErrorMess = false;
        window.location.reload();
        this.mess = '';
      }, 5000);
    }
  }

  sortRoleUser() {
    if(this.searchKey.length == 0){
      this.roleUser = (<HTMLSelectElement>document.getElementById('roleUser')).value;
      this.userService.getByRole(this.roleUser)
        .subscribe(
          data => {
            this.users = data;
            window.sessionStorage.setItem('ACC_LIST', JSON.stringify(this.users));
            this.countAll = this.users.length;
            this.countUsersByStatus(this.users);
            this.mesError = "";
            this.page = 1;
          },
          error => {
            this.mesError = "Không có kết quả";
          }
        );
    }
    else{
      this.roleUser = (<HTMLSelectElement>document.getElementById('roleUser')).value;
      this.checkSearching();
    }
  }

  showByAllAccount() {
    const list = window.sessionStorage.getItem('ACC_LIST');
    if (list) {
      this.users = JSON.parse(list);
    }
    this.mesError = "";
    this.page = 1;
  }
  sortByStatusUser(status: any) {
    let sortUser: User[] = [];
    this.users.forEach(user => {
      if (user.status == status) {
        sortUser.push(user);
      }
    });
    this.page = 1;
    return sortUser;
  }

  showByAccountActive() {
    const list = window.sessionStorage.getItem('ACC_LIST');
    if (list) {
      this.users = JSON.parse(list);
      this.users = this.sortByStatusUser(1);
    }
    this.mesError = "";
    this.page = 1;
  }

  showByAccountNotActive() {
    const list = window.sessionStorage.getItem('ACC_LIST');
    if (list) {
      this.users = JSON.parse(list);
      this.users = this.sortByStatusUser(0);
    }
    this.mesError = "";
    this.page = 1;
  }

  checkSearching() {
    var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    var inputValid = true;
    if (this.searchKey.length == 0) {
      this.mesError = 'Hãy nhập tên, email, SĐT, ....';
      inputValid = false;
    }
    if (format.test(this.searchKey)) {
      this.mesError = "Không được chứa các kí tự đặc biệt!";
      inputValid = false;
    }
    if (inputValid == true) {
      var role = '';
      if (this.roleUser) {
        role = this.roleUser;
      }
      else {
        role = 'all';
      }
      this.userService.getByInfo(this.searchKey, role)
        .subscribe(
          data => {
            if (data.length == 0) {
              this.users = [];
              this.mesError = "Không có kết quả";
            }
            else {
              this.users = data;
              this.mesError = "";
              this.page = 1;
              window.sessionStorage.setItem('ACC_LIST', JSON.stringify(this.users));
              this.countUsersByStatus(this.users);
              this.countAll = this.users.length;
            }
          },
          error => {
            this.users = [];
            this.mesError = "Không có kết quả";
          }
        );
    }
  }

  countUsersByStatus(userList: User[]) {
    this.countActive = 0;
    this.countDisabled = 0;
    userList.forEach(user => {
      if (user.status == 1) {
        this.countActive += 1;
      }
      if (user.status == 0) {
        this.countDisabled += 1;
      }
    });
  }

  getAllAccount() {
    this.userService.getAll()
      .subscribe(
        data => {
          this.users = data;
          this.countAll = this.users.length;
          window.sessionStorage.setItem('ACC_LIST', JSON.stringify(this.users));
          this.countUsersByStatus(this.users);
        },
        error => {
          console.log(error);
        }
      );
  }

  addAccount() {
    let dataUser = {
      userName: (<HTMLInputElement>document.getElementById('username')).value,
      passWord: '123456a',
      fullName: (<HTMLInputElement>document.getElementById('fullname')).value,
      email: (<HTMLInputElement>document.getElementById('email')).value,
      phoneNumber: (<HTMLInputElement>document.getElementById('phone')).value,
      role: (<HTMLSelectElement>document.getElementById('addRole')).value,
      status: (<HTMLSelectElement>document.querySelector('input[name="status"]:checked')).value
    }
    if ( this.validAddUserName(dataUser.userName)
      && this.validAddName(dataUser.fullName)
      && this.validAddEmail(dataUser.email)
      && this.validAddPhone(dataUser.phoneNumber)
    ) {
      (function ($) {
        $("#addAccount").attr('data-dismiss', 'modal');
      })(jQuery);
      this.auth.register(dataUser)
        .subscribe(
          res => {
            this.showToastMessage('Thêm tài khoản mới thành công', 'success');
          },
          error => {
            this.showToastMessage(error.error.message, 'error');
          }
        );
    }
  }

  editAccount() {
    let dataUser = {
      id: this.currUser.id,
      fullName: (<HTMLInputElement>document.getElementById('updateFullName')).value,
      email: (<HTMLInputElement>document.getElementById('updateEmail')).value,
      phoneNumber: (<HTMLInputElement>document.getElementById('updatePhone')).value,
      role: (<HTMLSelectElement>document.getElementById('updateRole')).value,
      status: (<HTMLSelectElement>document.querySelector('input[name="updateStatus"]:checked')).value
    }

    if (this.validEditName(dataUser.fullName)
      && this.validEditEmail(dataUser.email)
      && this.validEditPhone(dataUser.phoneNumber)
    ) {
      (function ($) {
        $("#editAccount").attr('data-dismiss', 'modal');
      })(jQuery);
      this.userService.updateUser(dataUser)
        .subscribe(
          data => {
            this.showToastMessage('Sửa tài khoản thành công', 'success');
          },
          err => {
            console.log(err);
            this.showToastMessage('Sửa tài khoản thất bại', 'error');
          }
        );
    }
  }

  deleteAccount() {
    this.messQuestion = 'Bạn có chắc muốn xoá tài khoản này không ?';
    this.messQuestionType = 'deleteAccount';
  }

  clickAcceptBecomeHost() {
    this.messQuestion = 'Bạn có chắc muốn duyệt người dùng này trở thành chủ nhà không ?';
    this.messQuestionType = 'acceptBecomeHost';
  }

  clickCancelBecomeHost() {
    this.messQuestion = 'Bạn có chắc muốn huỷ yêu cầu người dùng này trở thành chủ nhà không ?';
    this.messQuestionType = 'notAcceptBecomeHost';
  }

  changeStatusAccount(user: any) {
    if (user.status == 1) {
      this.messQuestion = 'Bạn có chắc muốn ẩn tài khoản này không ?';
      this.messQuestionType = 'inActiveAccount';
      this.currUser = user;
    } else if (user.status == 0) {
      this.messQuestion = 'Bạn có chắc muốn tài khoản này hoạt động không ?';
      this.messQuestionType = 'activeAccount';
      this.currUser = user;
    }
  }

  clickYES(user: any) {
    if (this.messQuestionType == 'inActiveAccount') {
      this.userService.changeStatusUser(user, 0).subscribe(
        res => {
          this.showToastMessage('Ẩn tài khoản thành công', 'success');
        }
      );

    } else if (this.messQuestionType == 'activeAccount') {
      this.userService.changeStatusUser(user, 1).subscribe(
        res => {
          this.showToastMessage('Tài khoản đã hoạt động trở lại thành công', 'success');
        }
      );
    }
  }

  private isNOTName(name: string) {
    let regex = /[0-9*|\":<>[\]{}`\\()';@&$!#%^+/,.?~\-]/g;
    let result = regex.test(name);
    return result;
  }

  private isNOTUserName(name: string) {
    let regex = /[*|\":<>[\]{}`\\()';@&$!#%^+/,.?~\-]/g;
    let result = regex.test(name);
    return result;
  }

  private validAddUserName(name: string) {
    let isValid = false;
    if (name == null || name.length == 0) {
      this.messAddUserName = 'Không được để trống';
      isValid = false;
    } else if (name.length < 4) {
      this.messAddUserName = 'Độ dài tối thiểu 4 kí tự';
      isValid = false;
    }else if (name.length > 10) {
      this.messAddUserName = 'Không được quá 10 ký tự';
      isValid = false;
    } else {
      if (this.isNOTUserName(name) == true) {
        this.messAddUserName = 'Tên tài khoản không được có kí tự đặc biệt';
        isValid = false;
      } else {
        this.messAddUserName = '';
        name = name.replace(/\s\s+/g, ' ');
        isValid = true;
      }
    }
    return isValid;
  }

  private validAddName(name: string) {
    let isValid = false;
    if (name == null || name.length == 0) {
      this.messAddName = 'Không được để trống';
      isValid = false;
    } else if (name.length > 50) {
      this.messAddName = 'Tên không được quá 50 ký tự';
      isValid = false;
    } else {
      if (this.isNOTName(name) == true) {
        this.messAddName = 'Tên không được có số hoặc kí tự đặc biệt';
        isValid = false;
      } else {
        this.messAddName = '';
        name = name.replace(/\s\s+/g, ' ');
        isValid = true;
      }
    }
    return isValid;
  }

  private validEditName(name: string) {
    let isValid = false;
    if (name == null || name.length == 0) {
      this.messEditName = 'Không được để trống';
      isValid = false;
    } else {
      if (this.isNOTName(name) == true) {
        this.messEditName = 'Tên không được có số hoặc kí tự đặc biệt';
        isValid = false;
      } else {
        this.messEditName = '';
        name = name.replace(/\s\s+/g, ' ');
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

  private validAddPhone(tel: string) {
    tel = tel.replace(/\s+/g, '');
    let isValid = false;
    if (tel == null || tel.length == 0) {
      this.messAddPhone = 'Không được để trống';
      isValid = false;
    } else {
      if (this.isCorrectPhone(tel) == false) {
        this.messAddPhone = 'Số điện thoại không đúng định dạng';
        isValid = false;
      } else if (tel.length < 10) {
        this.messAddPhone = 'Số điện thoại ít nhất là 10 số';
        isValid = false;
      } else {
        this.messAddPhone = '';
        isValid = true;
      }
    }
    return isValid;
  }

  private validEditPhone(tel: string) {
    tel = tel.replace(/\s+/g, '');
    let isValid = false;
    if (tel == null || tel.length == 0) {
      this.messEditPhone = 'Không được để trống';
      isValid = false;
    } else {
      if (this.isCorrectPhone(tel) == false) {
        this.messEditPhone = 'Số điện thoại không đúng định dạng';
        isValid = false;
      } else if (tel.length < 10) {
        this.messEditPhone = 'Số điện thoại ít nhất là 10 số';
        isValid = false;
      } else {
        this.messEditPhone = '';
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

  private validAddEmail(email: string) {
    let isValid = false;
    if (email == null || email.length == 0) {
      this.messAddEmail = 'Không được để trống';
      isValid = false;
    } else {
      if (this.isCorrectEmail(email) == false) {
        this.messAddEmail = 'Email không đúng định dạng';
        isValid = false;
      } else if (email == 'abc@gmail.com') {
        this.messAddEmail = 'Email này đã tồn tại';
        isValid = false;
      } else {
        this.messAddEmail = '';
        isValid = true;
      }
    }
    return isValid;
  }

  private validEditEmail(email: string) {
    let isValid = false;
    if (email == null || email.length == 0) {
      this.messEditEmail = 'Không được để trống';
      isValid = false;
    } else {
      if (this.isCorrectEmail(email) == false) {
        this.messEditEmail = 'Email không đúng định dạng';
        isValid = false;
      } else if (email == 'abc@gmail.com') {
        this.messEditEmail = 'Email này đã tồn tại';
        isValid = false;
      } else {
        this.messEditEmail = '';
        isValid = true;
      }
    }
    return isValid;
  }

}
