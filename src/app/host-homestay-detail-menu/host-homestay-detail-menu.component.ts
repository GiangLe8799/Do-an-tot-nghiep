import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../Services/token-storage.service';

@Component({
  selector: 'app-host-homestay-detail-menu',
  templateUrl: './host-homestay-detail-menu.component.html',
  styleUrls: ['./host-homestay-detail-menu.component.scss']
})
export class HostHomestayDetailMenuComponent implements OnInit {

  constructor(private token: TokenStorageService) { }

  ngOnInit(): void {
    document.body.scrollTop = 0;// For Safari
    document.documentElement.scrollTop = 0;// For Chrome, Firefox, IE and Opera
  }

}
