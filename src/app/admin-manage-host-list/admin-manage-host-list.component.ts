import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Setting } from '../models/setting.model';
import { User } from '../models/user.model';
import { AuthService } from '../Services/auth.service';
import { SettingService } from '../Services/setting.service';
import { TokenStorageService } from '../Services/token-storage.service';
import { UserService } from '../Services/user.service';

@Component({
  selector: 'app-admin-manage-host-list',
  templateUrl: './admin-manage-host-list.component.html',
  styleUrls: ['./admin-manage-host-list.component.scss']
})
export class AdminManageHostListComponent implements OnInit {
  istAccount: any;
  totalLengthAcc: any;
  page: number = 1;
  mesError: string = "";
  note: string = "Tài khoản của admin!";

  /* Message question */
  messQuestion: string = '';
  messQuestionType: string = '';

  /* Toast message */
  displayMess: boolean = false;
  mess: string = '';
  users: User[] = [];
  currUser: User = {};
  searchKey: string = '';

  userRoles: Setting[] = [];

  countAll = 0;
  countActive = 0;
  countDisabled = 0;
  countRequest = 0;

  constructor(private router: Router, private auth: AuthService,
    private userService: UserService, private token: TokenStorageService, private settingService: SettingService) { }

  ngOnInit(): void {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    this.getAllCustomerToHost();
    this.getCountRequestToHost();
  }

  showToastMessage(message: string) {
    this.displayMess = true;
    this.mess = message;
    setTimeout(() => {
      this.displayMess = false;
      this.mess = '';
    }, 2000);
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
      var role = 'all';
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

  showByAllAccount() {
    const list = window.sessionStorage.getItem('BE_HOST_LIST');
    if (list) {
      this.users = JSON.parse(list);
    }
  }

  showByRequests() {
    this.users = [];
    let newList: User[] = [];
    const list = window.sessionStorage.getItem('BE_HOST_LIST');
    if (list) {
      newList = JSON.parse(list);
    }
    newList.forEach(user => {
      if(user.role == 'ROLE_BE_HOST'){
        this.users.push(user);
      }
    });
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
    const list = window.sessionStorage.getItem('BE_HOST_LIST');
    if (list) {
      this.users = JSON.parse(list);
      this.users = this.sortByStatusUser(1);
    }
  }

  showByAccountNotActive() {
    const list = window.sessionStorage.getItem('BE_HOST_LIST');
    if (list) {
      this.users = JSON.parse(list);
      this.users = this.sortByStatusUser(0);
    }
  }

  getCountRequestToHost(): void{
    this.userService.getByRole('ROLE_BE_HOST').subscribe(
      res => {
        this.countRequest = res.length;
      }
    );
  }

  getAllCustomerToHost() {
    this.users = [];
    this.userService.getAll().subscribe(
      res => {
        res.forEach(user =>{
          if(user.role == 'ROLE_BE_HOST' || user.role == 'ROLE_HOST'){
            this.users.push(user);
          }
        });
        window.sessionStorage.removeItem('BE_HOST_LIST');
        window.sessionStorage.setItem('BE_HOST_LIST', JSON.stringify(this.users));
        this.page = 1;
        this.countAll = this.users.length;
        this.countUsersByStatus(this.users);
      }, error => {
        console.log(error);
      }
    );
  }

  countUsersByStatus(userList: User[]) {
    this.countActive = 0;
    this.countDisabled = 0;
    this.users.forEach(user => {
      if (user.status == 1) {
        this.countActive += 1;
      }
      if (user.status == 0) {
        this.countDisabled += 1;
      }
    });
  }

  clickAcceptBecomeHost(user: any) {
    this.messQuestion = 'Bạn có chắc muốn duyệt người dùng này trở thành chủ nhà không ?';
    this.messQuestionType = 'acceptBecomeHost';
    this.currUser = user;
  }

  clickCancelBecomeHost(user: any) {
    this.messQuestion = 'Bạn có chắc muốn huỷ yêu cầu người dùng này trở thành chủ nhà không ?';
    this.messQuestionType = 'notAcceptBecomeHost';
    this.currUser = user;
  }

  accountIsActive(user: any) {
    if (user.status == 1) {
      this.messQuestion = 'Bạn có chắc muốn tắt chức năng chủ nhà của tài khoản không ?';
      this.messQuestionType = 'inActiveAccount';
    } else if (user.status == 0) {
      this.messQuestion = 'Bạn có chắc muốn mở lại chức năng chủ nhà của tài khoản không ? ?';
      this.messQuestionType = 'activeAccount';
    }
    this.currUser = user;
  }

  clickYES(user: any) {
    if (this.messQuestionType == 'inActiveAccount') {
      this.userService.changeStatusUser(user, 0).subscribe(
        res => {
          this.showToastMessage('Ẩn tài khoản thành công');
        }
      );
    } else if (this.messQuestionType == 'activeAccount') {
      this.userService.changeStatusUser(user, 0).subscribe(
        res => {
          this.showToastMessage('Tài khoản đã hoạt động trở lại thành công');
        }
      );
    } else if (this.messQuestionType == 'acceptBecomeHost') {
      this.userService.changeRoleUser(user, 'ROLE_HOST').subscribe(
        res => {
          this.showToastMessage('Duyệt thành công');
        }
      );
    } else if (this.messQuestionType == 'notAcceptBecomeHost') {
      this.userService.changeRoleUser(user, 'ROLE_CUSTOMER').subscribe(
        res => {
          this.showToastMessage('Đã từ chối ' + user.fullName + ' trở thành chủ nhà');
        }
      );
    }
    this.currUser = {};
    this.messQuestion = '';
    this.messQuestionType = '';
  }
}
