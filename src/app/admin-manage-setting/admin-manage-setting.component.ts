import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../Services/token-storage.service';
import { SettingService } from '../Services/setting.service';
import { Setting } from '../models/setting.model';

@Component({
  selector: 'app-admin-manage-setting',
  templateUrl: './admin-manage-setting.component.html',
  styleUrls: ['./admin-manage-setting.component.scss']
})
export class AdminManageSettingComponent implements OnInit {
  totalLengthSettings: any;
  page: number = 1;
  mesError: string = "";

  isSettingActive: boolean = true;

  messAddNameSetting:string = '';
  messAddValueSetting:string = '';

  messEditNameSetting:string = '';
  messEditValueSetting:string = '';


  /* Message question */
  messQuestion: string = '';
  messQuestionType: string = '';

  /* Toast message */
  displaySuccessMess: boolean = false;
  displayErrorMess: boolean = false;
  mess: string = '';

  settings: Setting[] = [];
  typeList: string[] = [];
  currentSetting: Setting = {};
  newSetting: Setting = {};

  allLength = 0;
  activeLength = 0;
  inactiveLength = 0;

  constructor(private settingService: SettingService, private token: TokenStorageService) { }

  ngOnInit(): void {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    this.getAllSettings();
    this.getAllType();
  }

  setCurrentSetting(setting: any): void {
    this.currentSetting = setting;
  }

  changeEditSettingType(event: any): void {
    this.currentSetting.type = event.target.value;
  }

  saveNewSettingType(event: any): void {
    this.newSetting.type = event.target.value;
  }

  addSetting(): void {
    let name = (<HTMLInputElement>document.getElementById('settingName')).value;
    let value = (<HTMLInputElement>document.getElementById('settingValue')).value;
    if(
      this.validAddNameSetting(name)
      && this.validAddValueSetting(value)
    ) {
      if (!this.newSetting.type) {
        this.newSetting.type = 'ROLE';
      }
      this.newSetting.status = (<HTMLSelectElement>document.querySelector('input[name="newSettingStatus"]:checked')).value;
      this.settingService.create(this.newSetting).subscribe(
        res => {
          this.showToastMessage('Thêm mới thành công', 'success');
        },
        error => {
          this.showToastMessage('Thêm mới thất bại', 'error');
        }
      );
    }
  }

  updateSetting(): void {
    let name = (<HTMLInputElement>document.getElementById('editName')).value;
    let value = (<HTMLInputElement>document.getElementById('editValue')).value;
    let data = {
      id: this.currentSetting.id,
      name: this.currentSetting.name,
      type: this.currentSetting.type,
      value: this.currentSetting.value,
      status: (<HTMLSelectElement>document.querySelector('input[name="editSettingStatus"]:checked')).value
    }
    if(
      this.validEditNameSetting(name)
      && this.validEditValueSetting(value)
    ) {
      this.settingService.update(data).subscribe(
        res => {
          this.showToastMessage('Cập nhật thành công', 'success');
        },
        error => {
          this.showToastMessage('Cập nhật thất bại', 'error');
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
        window.location.reload();
        this.mess = '';
      }, 2000);
    } else if (typeMess == 'error') {
      this.displayErrorMess = true;
      this.mess = message;
      setTimeout(() => {
        this.displayErrorMess = false;
        window.location.reload();
        this.mess = '';
      }, 2000);
    }
  }

  getAllType(): void {
    this.settingService.getAllTypeSetting().subscribe(
      data => {
        this.typeList = data;
      },
      error => {
        console.log(error);
      }
    );

  }

  countStatusSetting(list: Setting[], status: number): number {
    let count = 0;
    list.forEach(st => {
      if (st.status == status) {
        count++;
      }
    });
    return count;
  }

  getAllSettings() {
    this.settingService.getAll().subscribe(
      data => {
        this.settings = data;
        this.allLength = this.settings.length;
        this.activeLength = this.countStatusSetting(this.settings, 1);
        this.inactiveLength = this.countStatusSetting(this.settings, 0);
        window.localStorage.setItem('settings', JSON.stringify(this.settings));
        this.page = 1;
      },
      error => {
        console.log(error);
      }
    );
  }

  sortByTypeSetting(event: any) {
    if (event.target.value == 'all') {
      this.getAllSettings();
    }
    else {
      this.settingService.getByType(event.target.value).subscribe(
        res => {
          this.settings = res;
          window.localStorage.setItem('settings', JSON.stringify(this.settings));
          this.page = 1;
        }, error => {
          console.log(error);
        }
      );
    }
  }

  showByAllSetting() {
    const oldSetts = window.localStorage.getItem('settings');
    if (oldSetts) {
      this.settings = JSON.parse(oldSetts);
    }
    this.page = 1;
  }

  showBySettingActive() {
    this.settings = [];
    let newSetts: Setting[] = [];
    const oldSetts = window.localStorage.getItem('settings');
    if (oldSetts) {
      newSetts = JSON.parse(oldSetts);
    }
    newSetts.forEach(st => {
      if (st.status == 1) {
        this.settings.push(st);
      }
    });
    this.page = 1;

  }

  showBySettingNotActive() {
    this.settings = [];
    let newSetts: Setting[] = [];
    const oldSetts = window.localStorage.getItem('settings');
    if (oldSetts) {
      newSetts = JSON.parse(oldSetts);
    }
    newSetts.forEach(st => {
      if (st.status == 0) {
        this.settings.push(st);
      }
    });
    this.page = 1;
  }

  settingIsActive(setting: any) {
    if (setting.status == 1) {
      this.messQuestion = 'Bạn có chắc muốn ẩn cài đặt này không ?';
      this.messQuestionType = 'settingInActive';
    } else if (setting.status == 0) {
      this.messQuestion = 'Bạn có chắc muốn bật cài đặt này không ?';
      this.messQuestionType = 'settingActive';
    }
    this.currentSetting = setting;
  }

  clickYES() {
    if (this.messQuestionType == 'settingInActive') {
      this.currentSetting.status = 0;
      this.settingService.update(this.currentSetting).subscribe(
        res => {
          this.showToastMessage('Ẩn cài đặt này thành công', 'success');
        }
      );
    } else if (this.messQuestionType == 'settingActive') {
      this.currentSetting.status = 1;
      this.settingService.update(this.currentSetting).subscribe(
        res => {
          this.showToastMessage('Cài đặt này đã hoạt động trở lại thành công', 'success');
        }
      );
    }
  }

  private isNOTName(name: string) {
    let regex = /[*|\":<>[\]{}`\\()';@&$!#%^+/,.?~\-]/g;
    let result = regex.test(name);
    return result;
  }

  private validAddNameSetting(name: string) {
    let isValid = false;
    if (name == null || name.length == 0) {
      this.messAddNameSetting = '*Không được để trống';
      isValid = false;
    } else if(name.length > 50) {
      this.messAddNameSetting = '*Không được dài quá 50 ký tự';
      name = name.replace(/\s\s+/g, ' ');
      isValid = true;
    } else if(this.isNOTName(name) == true) {
      this.messAddNameSetting = 'Không được có kí tự đặc biệt';
      isValid = false;
    } else {
      this.messAddNameSetting = '';
      name = name.replace(/\s\s+/g, ' ');
      isValid = true;
    }
    return isValid;
  }

  private validAddValueSetting(name: string) {
    let isValid = false;
    if (name == null || name.length == 0) {
      this.messAddValueSetting = '*Không được để trống';
      isValid = false;
    } else if(name.length > 50) {
      this.messAddValueSetting = '*Không được dài quá 50 ký tự';
      name = name.replace(/\s\s+/g, ' ');
      isValid = true;
    } else if(this.isNOTName(name) == true) {
      this.messAddValueSetting = 'Không được có kí tự đặc biệt';
      isValid = false;
    } else {
      this.messAddValueSetting = '';
      name = name.replace(/\s\s+/g, ' ');
      isValid = true;
    }
    return isValid;
  }

  private validEditNameSetting(name: string) {
    let isValid = false;
    if (name == null || name.length == 0) {
      this.messEditNameSetting = '*Không được để trống';
      isValid = false;
    } else if(name.length > 50) {
      this.messEditNameSetting = '*Không được dài quá 50 ký tự';
      name = name.replace(/\s\s+/g, ' ');
      isValid = true;
    } else if(this.isNOTName(name) == true) {
      this.messEditNameSetting = 'Không được có kí tự đặc biệt';
      isValid = false;
    } else {
      this.messEditNameSetting = '';
      name = name.replace(/\s\s+/g, ' ');
      isValid = true;
    }
    return isValid;
  }

  private validEditValueSetting(name: string) {
    let isValid = false;
    if (name == null || name.length == 0) {
      this.messEditValueSetting = '*Không được để trống';
      isValid = false;
    } else if(name.length > 50) {
      this.messEditValueSetting = '*Không được dài quá 50 ký tự';
      name = name.replace(/\s\s+/g, ' ');
      isValid = true;
    } else if(this.isNOTName(name) == true) {
      this.messEditValueSetting = 'Không được có kí tự đặc biệt';
      isValid = false;
    } else {
      this.messEditValueSetting = '';
      name = name.replace(/\s\s+/g, ' ');
      isValid = true;
    }
    return isValid;
  }
}
