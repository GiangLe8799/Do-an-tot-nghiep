import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Food } from '../models/food.model';
import { Province } from '../models/province.model';
import { FoodService } from '../Services/food.service';
import { ProvinceService } from '../Services/province.service';
import { TokenStorageService } from '../Services/token-storage.service';
declare var jQuery: any;
@Component({
  selector: 'app-admin-manage-location-food-list',
  templateUrl: './admin-manage-location-food-list.component.html',
  styleUrls: ['./admin-manage-location-food-list.component.scss']
})
export class AdminManageLocationFoodListComponent implements OnInit {

  totalLengthFood: any;
  page: number = 1;

  mesSearch: string = "";
  messAddNameFood: string = '';
  messEditNameFood: string = '';

  /* Message question */
  messQuestion: string = '';
  messQuestionType: string = '';

  /* Toast message */
  displaySuccessMess: boolean = false;
  displayErrorMess: boolean = false;
  mess: string = '';

  provinces: Province[] = [];
  foods: Food[] = [];
  currentProvinceId = 0;
  currentFood: Food = {};
  newProvince: Province = {};
  updateProvince: Province = {};
  allLength = 0;
  activeLength = 0;
  inactiveLength = 0;
  sortProvinceId = 0;


  constructor(private provinceService: ProvinceService, private foodService: FoodService,
    private token: TokenStorageService) { }

  ngOnInit(): void {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    window.localStorage.removeItem('foods');
    this.getAllProvinces();
    this.getAllFoods();
  }

  getAllProvinces() {
    this.provinceService.getAll()
      .subscribe(
        data => {
          this.provinces = data;
          this.newProvince = this.provinces[0];
        },
        error => {
          console.log(error);
        }
      );
  }

  countStatusFoods(list: Food[], status: number): number {
    let count = 0;
    list.forEach(food => {
      if (food.status === status) {
        count++;
      }
    });
    return count;
  }

  getAllFoods(): void {
    this.foodService.getAll().subscribe(
      data => {
        this.foods = data;
        this.mesSearch = "";
        this.page = 1;
        this.allLength = this.foods.length;
        this.activeLength = this.countStatusFoods(this.foods, 1);
        this.inactiveLength = this.countStatusFoods(this.foods, 0);
        window.localStorage.setItem('foods', JSON.stringify(this.foods));
      },
      error => {
        console.log(error);
      }
    );
  }

  getFoodsByProvince(id: any): void {
    this.foodService.getByProvince(id).subscribe(
      data => {
        this.foods = data;
        this.mesSearch = "";
        this.page = 1;
        this.allLength = this.foods.length;
        this.activeLength = this.countStatusFoods(this.foods, 1);
        this.inactiveLength = this.countStatusFoods(this.foods, 0);
        window.localStorage.setItem('foods', JSON.stringify(this.foods));
      },
      error => {
        this.showToastMessage('L???y d??? li???u m??n ??n theo t???nh th???t b???i', 'error');
      }
    );
  }

  sortByCity(event: any) {
    var search = (<HTMLInputElement>document.getElementById("search")).value;
    if (event.target.value == 'all') {
      this.sortProvinceId = 0;
      if (search.length == 0) {
        this.getAllFoods();
      }
      else {
        this.checkSearching();
      }

    }
    else {
      this.sortProvinceId = event.target.value;
      if (search.length == 0) {
        this.getFoodsByProvince(event.target.value);
      }
      else {
        this.checkSearching();
      }
    }
  }

  getCurrentFood(id: any): void {
    this.foodService.get(id).subscribe(
      data => {
        this.currentFood = data;
        // this.getAllProvinces();
        this.updateProvince = this.currentFood.province!;
      },
      error => {
        this.showToastMessage('L???y d??? li???u m??n ??n th???t b???i', 'error');
      }
    );
  }

  saveNewProvinceForFood(event: any): void {
    this.provinceService.get(event.target.value).subscribe(
      res => {
        this.newProvince = res;
      },
      error => {
        this.showToastMessage('L??u t???nh c???a th??m m???i m??n ??n th???t b???i', 'error');
      }
    );
  }

  showAllFood() {
    const oldFoods = window.localStorage.getItem('foods');
    if (oldFoods) {
      this.foods = JSON.parse(oldFoods);
    }
    this.mesSearch = "";
    this.page = 1;
  }

  getFoodsByStatus(status: number): void {
    this.foods = [];
    let newFoods: Food[] = [];
    const oldFoods = window.localStorage.getItem('foods');
    if (oldFoods) {
      newFoods = JSON.parse(oldFoods);
    }
    newFoods.forEach(food => {
      if (food.status == status) {
        this.foods.push(food);
      }
    });
    this.mesSearch = "";
    this.page = 1;
  }

  validSearchKey(key: string): boolean {
    var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    var inputValid = true;
    if (key.length == 0) {
      this.mesSearch = 'Nh???p k?? t??? b???n mu???n ....';
      inputValid = false;
    } else if (key.length > 50) {
      this.mesSearch = "Nh???p t??n m??n ??n d?????i 50 k?? t???!";
      inputValid = false;
    }
    if (format.test(key)) {
      this.mesSearch = "Kh??ng ???????c nh???p c??c k?? t??? ?????c bi???t!";
      inputValid = false;
    }
    return inputValid;
  }

  checkSearching() {
    var search = (<HTMLInputElement>document.getElementById("search")).value;
    if (this.validSearchKey(search)) {
      this.foodService.getByName(search, this.sortProvinceId)
        .subscribe(
          data => {
            this.foods = data;
            window.localStorage.setItem('foods', JSON.stringify(this.foods));
            this.allLength = this.foods.length;
            this.activeLength = this.countStatusFoods(this.foods, 1);
            this.inactiveLength = this.countStatusFoods(this.foods, 0);
            this.mesSearch = "";
            this.page = 1;
          },
          error => {
            this.mesSearch = "Kh??ng t??m th???y k???t qu??? ph?? h???p!";
            this.foods = [];
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

  addFood() {
    let data = {
      province: this.newProvince,
      foodName: (<HTMLInputElement>document.getElementById('newFoodName')).value,
      status: (<HTMLSelectElement>document.querySelector('input[name="newFoodStatus"]:checked')).value
    }
    if (this.validAddNameFood(data.foodName)
    ) {
      this.foodService.create(data).subscribe(
        res => {
          (function ($) {
            $("#addFood").attr('data-dismiss', 'modal');
          })(jQuery);
          this.showToastMessage('Th??m th??nh c??ng', 'success');
        },
        error => {
          this.showToastMessage('Th??m th???t b???i', 'error');
        }
      );

    }
  }

  saveUpdateProvince(event: any): void {
    this.provinceService.get(event.target.value).subscribe(
      res => {
        this.updateProvince = res;
      },
      error => {
        this.showToastMessage('L??u t???nh c???a edit m??n ??n th???t b???i', 'error');
      }
    );
  }

  editFood() {
    let data = {
      id: this.currentFood.id,
      province: this.updateProvince,
      foodName: (<HTMLInputElement>document.getElementById('editFoodName')).value,
      status: (<HTMLSelectElement>document.querySelector('input[name="editFoodStatus"]:checked')).value

    }
    if (this.validEditNameFood(data.foodName)
    ) {
      this.foodService.update(data).subscribe(
        res => {
          (function ($) {
            $("#editFood").attr('data-dismiss', 'modal');
          })(jQuery);
          this.showToastMessage('Ch???nh s???a th??nh c??ng', 'success');
        },
        error => {
          this.showToastMessage('Ch???nh s???a th???t b???i', 'error');
        }
      );
    }
  }

  changeStatusFood(food: any) {
    if (food.status == true) {
      this.messQuestion = 'B???n c?? ch???c mu???n ???n m??n ??n n??y kh??ng ?';
      this.messQuestionType = 'inActiveFood';
    } else if (food.status == false) {
      this.messQuestion = 'B???n c?? ch???c mu???n hi???n m??n ??n kh??ng ?';
      this.messQuestionType = 'activeFood';
    }
    this.currentFood = food;
  }

  clickYES() {
    if (this.messQuestionType == 'inActiveFood') {
      this.foodService.setStatus(this.currentFood.id, 0).subscribe(
        res => {
          this.showToastMessage('???n m??n ??n th??nh c??ng', 'success');
        },
        error => {
          this.showToastMessage('???n m??n ??n th???t b???i', 'error');
        }
      );

    } else if (this.messQuestionType == 'activeFood') {
      this.foodService.setStatus(this.currentFood.id, 1).subscribe(
        res => {
          this.showToastMessage('Hi???n m??n ??n th??nh c??ng', 'success');
        },
        error => {
          this.showToastMessage('Hi???n m??n ??n th???t b???i', 'error');
        }
      );

    }
  }

  private validAddNameFood(name: string) {
    let isValid = false;
    if (name == null || name.length == 0) {
      this.messAddNameFood = '*Kh??ng ???????c ????? tr???ng';
      isValid = false;
    } else {
      this.messAddNameFood = '';
      name = name.replace(/\s\s+/g, ' ');
      isValid = true;
    }
    return isValid;
  }

  private validEditNameFood(name: string) {
    let isValid = false;
    if (name == null || name.length == 0) {
      this.messEditNameFood = '*Kh??ng ???????c ????? tr???ng';
      isValid = false;
    } else {
      this.messEditNameFood = '';
      name = name.replace(/\s\s+/g, ' ');
      isValid = true;
    }
    return isValid;
  }

}
