import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Blog } from '../models/blog.model';
import { BlogService } from '../Services/blog.service';
import { FileUploadService } from '../Services/file-upload.service';
import { TokenStorageService } from '../Services/token-storage.service';
@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.scss']
})
export class BlogDetailComponent implements OnInit {
  img1: string = "assets/images/bedroom.jpg";
  img2: string = "assets/images/littleColmar.jpg";
  imgBlogTravel: string = "assets/images/HaGiang.jpg";
  listBlog: Blog[] = [];
  currentBlog: Blog = {};
  currentBlogId: any;
  imgList = new Map();

  fileInfos?: Observable<any>;

  constructor(private route: ActivatedRoute, private router: Router, private blogService: BlogService, 
    private token: TokenStorageService, private uploadService: FileUploadService) { }

  ngOnInit(): void {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    this.route.queryParams.subscribe(params => {
      this.currentBlogId = params.currentBlogId;
    });
    this.getBlogById(this.currentBlogId);
    this.uploadService.getFiles().subscribe(
      data => {
        this.fileInfos = data;
        this.fileInfos!.forEach(element => {
          this.imgList.set(element.name, element.url);
        });
      }
    );
    window.sessionStorage.removeItem("search-key");
  }

  getOtherBlogs(): void{
    this.blogService.getTopByCategoryAndDate(this.currentBlog.category!).subscribe(
      res => {
        this.listBlog = res;
      }
    );
  }

  getBlogById(blogId: any): void {
    this.blogService.get(blogId)
    .subscribe(
      data => {
        this.currentBlog = data;
        this.getOtherBlogs();
      },
      error => {
        console.log(error);
      }
    );
  }

  navigateToBlogDetail(blogId: any): void {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        currentBlogId: blogId
      }
    }
    this.router.navigate(['blog-detail'], navigationExtras).then(() => {window.location.reload()});
  }
  navigateToBlogList(destinationId: any): void {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        currentDestinationId: destinationId
      }
    }
    this.router.navigate(['blog-list'], navigationExtras);
  }
}
