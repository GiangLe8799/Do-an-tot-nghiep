import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Homestay } from '../models/homestay.model';
import { User } from '../models/user.model';
import { FileUploadService } from '../Services/file-upload.service';
import { HomestayService } from '../Services/homestay.service';
import { TokenStorageService } from '../Services/token-storage.service';
import { UserService } from '../Services/user.service';
declare var jQuery: any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  logo: string = "./assets/images/logo.png";
  defaultAva: string = "./assets/images/defaultAva.jpg";
  displayMenuMobile: string = "none";
  isOpenMenuMobile: boolean = false;
  isChangeBgColorIcMenuMobile: boolean = false;

  @ViewChild('menuMobi_1') menuMobi_1!: ElementRef;
  @ViewChild('menuMobi_2') menuMobi_2!: ElementRef;

  isOpenMenuUser: boolean = false;
  displayMenuUser: string = "none";
  @ViewChild('menuUser') menuUser!: ElementRef;

  public isLoggedIn = false;
  public currentUser: User = {
    id: 0,
    userName: '',
    passWord: '',
    fullName: '',
    phoneNumber: '',
    dob: '',
    email: '',
    status: -1,
    userPhoto: '',
    role: ''
  };

  searchKey = '';
  homestayList: Homestay[] = [];

  fileInfos?: Observable<any>;

  constructor(private render2: Renderer2, private token: TokenStorageService, private router: Router,
    private userService: UserService, private uploadService: FileUploadService, private homestayService: HomestayService) {
    this.render2.listen('window', 'click', (e: Event) => {
      if (e.target !== this.menuMobi_1.nativeElement &&
        e.target !== this.menuMobi_2.nativeElement) {
        this.isOpenMenuMobile = false;
        this.isChangeBgColorIcMenuMobile = false;
        this.displayMenuMobile = "none";
      }

      if (e.target !== this.menuUser.nativeElement) {
        this.isOpenMenuUser = false;
        this.displayMenuUser = "none";
      }
    });
  }

  ngOnInit(): void {
    document.body.scrollTop = 0;// For Safari
    document.documentElement.scrollTop = 0;// For Chrome, Firefox, IE and Opera
    (function ($) {
      $(document).click(function (event: Event) {
        //alert((event.target as Element).className);
      });
    })(jQuery);
    if (this.token.getToken()) {
      this.isLoggedIn = true;
      this.getCurrentUser(this.token.getUser().username);
    }

    if (this.token.getSearchKey()) {
      this.searchKey = this.token.getSearchKey()!;
    }

  }

  getCurrentUser(userName: string): void {
    this.userService.getByUsername(userName)
      .subscribe(
        data => {
          this.currentUser = data;
          this.uploadService.getFiles().subscribe(
            data => {
              this.fileInfos = data;
              this.fileInfos!.forEach(element => {
                if (element.name == 'avatar' + this.currentUser.id + '.jpg') {
                  this.defaultAva = element.url;
                }

              });
            }
          );
          console.log(this.currentUser);
        },
        error => {
          console.log(error);
        }
      );
  }

  logout(): void {
    this.token.signOut();
    this.router.navigate(['home']).then(() => { window.location.reload() });
  }



  openMenuMobile() {
    this.isOpenMenuMobile = !this.isOpenMenuMobile;
    this.isChangeBgColorIcMenuMobile = !this.isChangeBgColorIcMenuMobile;
    if (this.isOpenMenuMobile) {
      this.displayMenuMobile = "block";
    } else {
      this.displayMenuMobile = "none";
    }
  }


  openMenuUser() {
    this.isOpenMenuUser = !this.isOpenMenuUser;
    if (this.isOpenMenuUser) {
      this.displayMenuUser = "block";
    } else {
      this.displayMenuUser = "none";
    }
  }

  searchHomestay() {
    this.searchKey = (<HTMLInputElement>document.getElementById('searchKey')).value;
    window.sessionStorage.setItem("search-key", this.searchKey);
    this.router.navigate(['/searching-found']);
    if (window.location.pathname == '/searching-found') {
      window.location.reload();
    }
  }

}
