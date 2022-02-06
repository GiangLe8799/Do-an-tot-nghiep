import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Blog } from '../models/blog.model';
import { BlogService } from '../Services/blog.service';
import { FileUploadService } from '../Services/file-upload.service';
import { GetDataService } from '../Services/get-data.service';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss']
})
export class BlogListComponent implements OnInit {
  imgDefaultHomestay: string = "./assets/images/defaultHomestay.jpg";
  listBlogBusiness: any;
  totalLengthBlog: any;
  totalLengthBusiness: any;
  page: number = 1;
  listBlog: Blog[] = [];
  destinationId: any;
  imgList = new Map();

  fileInfos?: Observable<any>;

  constructor(private route: ActivatedRoute, private router: Router, private blogService: BlogService, 
    private uploadService: FileUploadService) {
  }

  ngOnInit(): void {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    this.route.queryParams.subscribe(params => {
      this.destinationId = params.destinationId;
    });
    this.getAllBlogs();
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

  getAllBlogs(): void {
    this.blogService.getAll().subscribe(
      res => {
        res.forEach(blog => {
          if(blog.status == 1){
            this.listBlog.push(blog);
          }
        });
        
      }, error => {
        console.log(error);
      }
    );
  }

  getAllByDestination(destinationId: any): void {
    this.blogService.getAllByDestination(destinationId)
      .subscribe(
        data => {
          data.forEach(blog => {
            if(blog.status == 1){
              this.listBlog.push(blog);
            }
          });
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
    this.router.navigate(['blog-detail'], navigationExtras);
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
