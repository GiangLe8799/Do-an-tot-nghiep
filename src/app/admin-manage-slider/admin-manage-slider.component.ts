import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../Services/token-storage.service';

@Component({
  selector: 'app-admin-manage-slider',
  templateUrl: './admin-manage-slider.component.html',
  styleUrls: ['./admin-manage-slider.component.scss']
})
export class AdminManageSliderComponent implements OnInit {

  constructor(private token: TokenStorageService) { }

  ngOnInit(): void {
  }

}
