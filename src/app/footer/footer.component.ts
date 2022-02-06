import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  logo:string = "./assets/images/logo.png";
  iconFb:string = "./assets/images/facebook.png";
  iconInsta:string = "./assets/images/instagram.png";
  linkFb:string = "https://www.facebook.com/luxstay/";
  linkInsta:string = "https://www.instagram.com/luxstay/";
  linkYtube:string = "https://www.youtube.com/";
  constructor() { }

  ngOnInit(): void {
    document.body.scrollTop = 0;// For Safari
    document.documentElement.scrollTop = 0;// For Chrome, Firefox, IE and Opera
  }

}
