import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Homestay } from '../models/homestay.model';
import { Setting } from '../models/setting.model';
import { User } from '../models/user.model';
import { HomestayService } from '../Services/homestay.service';
import { SettingService } from '../Services/setting.service';
import { TokenStorageService } from '../Services/token-storage.service';
import { UserService } from '../Services/user.service';

@Component({
  selector: 'app-host-homestay-list',
  templateUrl: './host-homestay-list.component.html',
  styleUrls: ['./host-homestay-list.component.scss']
})
export class HostHomestayListComponent implements OnInit {

  totalPage: any;
  page: number = 1;

  search: string = '';
  messErrorSearch: string = '';
  currency: any = new Intl.NumberFormat('en');

  /* HTML */
  typeShow: number = 1;

  /* end */

  typeHomestay: string = '';

  /* Message question */
  messQuestion: string = '';
  messQuestionType: string = '';

  /* Toast message */
  displaySuccessMess: boolean = false;
  displayErrorMess: boolean = false;
  mess: string = '';

  public currentUser: User = {};
  homestayList: Homestay[] = [];
  typeList: Setting[] = [];
  currentHomestay: Homestay = {};
  searchKey = '';

  countAll = 0;
  countActive = 0;
  countDisabled = 0;

  constructor(private homestayService: HomestayService, private userService: UserService,
    private token: TokenStorageService, private router: Router, private settingService: SettingService) { }

  ngOnInit(): void {
    document.body.scrollTop = 0;// For Safari
    document.documentElement.scrollTop = 0;// For Chrome, Firefox, IE and Opera
    if (this.token.getToken()) {
      this.getCurrentUser(this.token.getUser().username);
    }
    this.getTypeSetting();
  }

  countByStatus(homestays: Homestay[]) {
    this.countActive = 0;
    this.countDisabled = 0;
    homestays.forEach(hs => {
      if (hs.status == 1) {
        this.countActive += 1;
      }
      if (hs.status == 0) {
        this.countDisabled += 1;
      }
    });
  }

  navigateToHomestayEdit(homestayId: any): void {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        currentHomestayId: homestayId
      }
    }
    this.router.navigate(['host/homestay-list/detail/edit'], navigationExtras);
  }

  getCurrentUser(userName: string): void {
    this.userService.getByUsername(userName)
      .subscribe(
        data => {
          this.currentUser = data;
          this.getHomestaysByUser('all');
        },
        error => {
          console.log(error);
        }
      );
  }

  getTypeSetting(): void {
    this.settingService.getByType('HOMESTAY_TYPE').subscribe(
      res => {
        this.typeList = res;
      }
    );
  }

  showTypeText(type: any): any {
    let text = '';
    this.typeList.forEach(t => {
      if (t.value == type) {
        text = t.name!;
      }
    });
    return text;
  }

  getHomestaysByUser(type: string): void {
    if(this.searchKey.length == 0){
      this.homestayService.getByUser(this.currentUser.id, type,'no-search').subscribe(
        data => {
          this.homestayList = data;
          this.countAll = this.homestayList.length;
          this.countByStatus(this.homestayList);
          this.searchKey = '';
          this.mess = "";
          window.localStorage.setItem('host-homestay-' + this.currentUser.id, JSON.stringify(this.homestayList));
        },
        error => {
          console.log(error);
        }
      );
    }
    else{
      this.homestayService.getByUser(this.currentUser.id, type,this.searchKey).subscribe(
        data => {
          this.homestayList = data;
          this.countAll = this.homestayList.length;
          this.countByStatus(this.homestayList);
          this.mess = "";
          window.localStorage.setItem('host-homestay-' + this.currentUser.id, JSON.stringify(this.homestayList));
        },
        error => {
          console.log(error);
        }
      );
    }
    
  }


  showToastMessage(message: string, typeMess: string) {
    if (typeMess == 'success') {
      this.displaySuccessMess = true;
      this.mess = message;
      setTimeout(() => {
        this.displaySuccessMess = false;
        this.mess = '';
        window.location.reload();
      }, 2000);
    } else if (typeMess == 'error') {
      this.displayErrorMess = true;
      this.mess = message;
      setTimeout(() => {
        this.displayErrorMess = false;
        this.mess = '';
        window.location.reload();
      }, 2000);
    }
  }

  showAllList() {
    const olds = window.localStorage.getItem('host-homestay-' + this.currentUser.id);
    if (olds) {
      this.homestayList = JSON.parse(olds);
    }
    this.typeShow = 1;
    this.mess = "";
    this.page = 1;
  }

  showListByStatus(status: number) {
    if(status == 1){
      this.typeShow = 2;
    }
    else{
      this.typeShow = 3;
    }
    this.homestayList = [];
    let newHomes: Homestay[] = [];
    const olds = window.localStorage.getItem('host-homestay-' + this.currentUser.id);
    if (olds) {
      newHomes = JSON.parse(olds);
    }
    newHomes.forEach(hs => {
      if (hs.status == status) {
        this.homestayList.push(hs);
      }
    });
    this.mess = "";
    this.page = 1;
  }

  deleteHomestay() {
    this.messQuestion = 'Bạn có chắc muốn xoá chỗ ở này không ?';
    this.messQuestionType = 'deleteHomestay';
  }

  public sortHomestayByType() {
    this.typeHomestay = (<HTMLSelectElement>document.getElementById('typeHomestay')).value;
    this.getHomestaysByUser(this.typeHomestay);
  }

  searchHomestay() {
    this.search = (<HTMLInputElement>document.getElementById('search')).value;
    if (this.validSearch(this.search)) {
      this.typeHomestay = (<HTMLSelectElement>document.getElementById('typeHomestay')).value;
      this.homestayService.getByUser(this.currentUser.id, this.typeHomestay,this.searchKey).subscribe(
        data => {
          if (data) {
            this.homestayList = data;
            this.countAll = this.homestayList.length;
            this.countByStatus(this.homestayList);
            window.localStorage.setItem('host-homestay-' + this.currentUser.id, JSON.stringify(this.homestayList));
            this.mess = "";
            this.page = 1;
          }
        },
        error => {
          this.homestayList = [];
          console.log(error);
        }
      );
    }
  }

  private validSearch(search: string) {
    let isValid = false;
    if (search == null || search.length == 0) {
      this.messErrorSearch = '*Không được để trống';
      isValid = false;
    } else {
      this.messErrorSearch = '';
      isValid = true;
    }
    return isValid;
  }

  homestayIsActive(homestay: Homestay) {
    if (homestay.status == 1) {
      this.messQuestion = 'Bạn có chắc muốn ẩn chỗ ở này không ?';
      this.messQuestionType = 'inActiveHomestay';
    } else if (homestay.status == 0) {
      this.messQuestion = 'Bạn có chắc muốn chỗ ở này hoạt động không ?';
      this.messQuestionType = 'activeHomestay';
    }
    this.currentHomestay = homestay;
  }

  clickYES() {
    if (this.messQuestionType == 'inActiveHomestay') {
      this.homestayService.changeStatus(0, this.currentHomestay.id).subscribe(
        res => {
          this.showToastMessage('Ẩn chỗ ở thành công', 'success');
        }, error => { console.log(error); }
      );
    } else if (this.messQuestionType == 'activeHomestay') {
      this.homestayService.changeStatus(1, this.currentHomestay.id).subscribe(
        res => {
          this.showToastMessage('Chỗ ở đã hoạt động trở lại thành công', 'success');
        }, error => { console.log(error); }
      );
    }
  }

}
