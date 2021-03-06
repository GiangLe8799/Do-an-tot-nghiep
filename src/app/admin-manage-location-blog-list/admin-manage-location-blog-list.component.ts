import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Blog } from '../models/blog.model';
import { Setting } from '../models/setting.model';
import { BlogService } from '../Services/blog.service';
import { SettingService } from '../Services/setting.service';
import { TokenStorageService } from '../Services/token-storage.service';

@Component({
  selector: 'app-admin-manage-location-blog-list',
  templateUrl: './admin-manage-location-blog-list.component.html',
  styleUrls: ['./admin-manage-location-blog-list.component.scss']
})
export class AdminManageLocationBlogListComponent implements OnInit {
  myDate: any = new Date();
  page: number = 1;
  messSearch: string = "";

  /*show list blog by type*/
  showListBlogByType: string = 'all';

  /* Message question */
  messQuestion: string = '';
  messQuestionType: string = '';

  /* Toast message */
  displaySuccessMess: boolean = false;
  displayErrorMess: boolean = false;
  mess: string = '';

  blogs: Blog[] = [];
  categories: Setting[] = [];
  currentBlog: Blog = {};

  allLength = 0;
  activeLength = 0;
  inactiveLength = 0;

  searchKey: string = '';

  constructor(private token: TokenStorageService, private blogService: BlogService,
    private router: Router, private settingService: SettingService) { }

  ngOnInit(): void {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    this.getAllBlog();
    this.getCategorySetting();
  }

  countStatusBlog(list: Blog[], status: number): number {
    let count = 0;
    list.forEach(blog => {
      if (blog.status === status) {
        count++;
      }
    });
    return count;
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

  sortByTypeBlog() {
    this.messSearch = "";
    this.showListBlogByType = (<HTMLSelectElement>document.getElementById('sortBlog')).value;
    var search = (<HTMLInputElement>document.getElementById("search")).value;
    if(search.length == 0){
      search = 'no-search';
    }
    this.blogService.getByNameAndCategory(search, this.showListBlogByType).subscribe(
      res => {
        this.blogs = res;
        window.localStorage.setItem('blogs', JSON.stringify(this.blogs));
        this.allLength = this.blogs.length;
        this.activeLength = this.countStatusBlog(this.blogs, 1);
        this.inactiveLength = this.countStatusBlog(this.blogs, 0);
        this.page = 1;
      }
      , error => {
        this.blogs = [];
        this.page = 1;
        this.messSearch = "Kh??ng c?? k???t qu???";
      }
    );
  }

  getAllBlog() {
    this.blogService.getAll().subscribe(
      data => {
        this.blogs = data;
        window.localStorage.setItem('blogs', JSON.stringify(this.blogs));
        this.allLength = this.blogs.length;
        this.activeLength = this.countStatusBlog(this.blogs, 1);
        this.inactiveLength = this.countStatusBlog(this.blogs, 0);
        this.page = 1;
        this.messSearch = "";
      },
      error => {
        this.showToastMessage("L???y d??? li???u th???t b???i!", 'error');
      }
    );
  }

  showAll(): void {
    const oldBlogs = window.localStorage.getItem('blogs');
    if (oldBlogs) {
      this.blogs = JSON.parse(oldBlogs);
    }
    this.messSearch = "";
    this.page = 1;
  }

  getBlogsByStatus(status: number): void {
    this.blogs = [];
    let newBlogs: Blog[] = [];
    const oldBlogs = window.localStorage.getItem('blogs');
    if (oldBlogs) {
      newBlogs = JSON.parse(oldBlogs);
    }
    newBlogs.forEach(blog => {
      if (blog.status == status) {
        this.blogs.push(blog);
      }
    });
    this.messSearch = "";
    this.page = 1;
  }

  getCategorySetting(): void {
    this.settingService.getByType('CATEGORY').subscribe(
      res => {
        this.categories = res;
      }
    );
  }

  showCategoryText(category: any): any {
    let text = '';
    this.categories.forEach(c => {
      if (c.name == category) {
        text = c.value!;
      }
    });
    return text;
  }

  navigateToBlogDetail(id: any) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        currentBlogId: id
      }
    }
    this.router.navigate(['/admin/blog-list/detail'], navigationExtras);
  }
  validateSearch(search: any): boolean {
    var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    var inputValid = true;
    if (search.length == 0) {
      this.messSearch = 'T??n blog kh??ng ???????c ????? tr???ng!';
      inputValid = false;
    }
    if (format.test(search)) {
      this.messSearch = "Kh??ng ???????c ch???a c??c k?? t??? ?????c bi???t!";
      inputValid = false;
    }
    return inputValid;
  }

  checkSearching() {
    var search = (<HTMLInputElement>document.getElementById("search")).value;
    if(this.validateSearch(search)){
      this.blogService.getByNameAndCategory(search, this.showListBlogByType).subscribe(
        res => {
          this.blogs = res;
          window.localStorage.setItem('blogs', JSON.stringify(this.blogs));
          this.allLength = this.blogs.length;
          this.activeLength = this.countStatusBlog(this.blogs, 1);
          this.inactiveLength = this.countStatusBlog(this.blogs, 0);
          this.page = 1;
          this.messSearch = "";
        }
        , error => {
          this.blogs = [];
          this.page = 1;
          this.messSearch = "Kh??ng c?? k???t qu???";
        }
      );
    }
  }

  addBlog() {
    this.showToastMessage('Th??m th??nh c??ng', 'success');
  }

  blogIsActive(blog: Blog) {
    if (blog.status == 1) {
      this.messQuestion = 'B???n c?? ch???c mu???n ???n b??i vi???t n??y kh??ng ?';
      this.messQuestionType = 'inActiveBlog';
    } else if (blog.status == 0) {
      this.messQuestion = 'B???n c?? ch???c mu???n b??i vi???t n??y ho???t ?????ng kh??ng ?';
      this.messQuestionType = 'activeBlog';
    }
    this.currentBlog = blog;
  }

  clickYES(id: any) {
    if (this.messQuestionType == 'inActiveBlog') {
      this.blogService.changeStatus(0, id).subscribe(
        res => {
          this.showToastMessage('???n b??i vi???t th??nh c??ng', 'success');
        }, err => {
          console.log(err);
        }
      );
    } else if (this.messQuestionType == 'activeBlog') {
      this.blogService.changeStatus(1, id).subscribe(
        res => {
          this.showToastMessage('B??i vi???t ???? hi???n tr??? l???i th??nh c??ng', 'success');
        }, err => {
          console.log(err);
        }
      );
    }
  }

}
