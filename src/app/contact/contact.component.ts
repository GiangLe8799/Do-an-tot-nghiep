import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  imgBgContact:string = './assets/images/bg_contact.jpg';
  linkFb:string = "https://www.facebook.com/luxstay/";
  linkInsta:string = "https://www.instagram.com/luxstay/";
  linkYtube:string = "https://www.youtube.com/";
  constructor() { }

  ngOnInit(): void {
    document.body.scrollTop = 0;// For Safari
    document.documentElement.scrollTop = 0;// For Chrome, Firefox, IE and Opera
  }

}
