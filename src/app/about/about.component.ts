import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  img_1:string = './assets/images/bg_blue_sky.jpg';
  //img_2:string = './assets/images/moon.png';
  img_3:string = './assets/images/mountain.png';
  img_4:string = './assets/images/road.png';
  //img_5:string = './assets/images/house.png';
  id_img_1:any = (<HTMLImageElement>document.getElementById('img_1'));
  //id_img_2:any = (<HTMLImageElement>document.getElementById('img_2'));
  id_img_3:any = (<HTMLImageElement>document.getElementById('img_3'));
  id_img_4:any = (<HTMLImageElement>document.getElementById('img_4'));
  id_txt_title:any = (<HTMLElement>document.getElementById('txt_title'));
  constructor() { }

  ngOnInit(): void {
    document.body.scrollTop = 0;// For Safari
    document.documentElement.scrollTop = 0;// For Chrome, Firefox, IE and Opera
    //let id_img_1 = document.getElementById('img_1');
    window.addEventListener('scroll', function(){
      let value = this.window.scrollY;
      (<HTMLImageElement>document.getElementById('img_1')).style.top = value * 0.5 + 'px';
      //(<HTMLImageElement>document.getElementById('img_2')).style.left = -value * 0.5 + 'px';
      (<HTMLImageElement>document.getElementById('img_3')).style.top = -value * 0.15 + 'px';
      (<HTMLImageElement>document.getElementById('img_4')).style.top = value * 0.15 + 'px';
      (<HTMLElement>document.getElementById('txt_title')).style.top = value * 1 + 'px';
    })
  }

}
