import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../Services/token-storage.service';

@Component({
  selector: 'app-host-homestay-feedback',
  templateUrl: './host-homestay-feedback.component.html',
  styleUrls: ['./host-homestay-feedback.component.scss']
})
export class HostHomestayFeedbackComponent implements OnInit {

  isShowComment:boolean = true;

  /* Message question */
  messQuestion:string = '';
  messQuestionType:string = '';

  /* Toast message */
  displaySuccessMess:boolean = false;
  displayErrorMess:boolean = false;
  mess:string='';

  constructor(private token: TokenStorageService) { }

  ngOnInit(): void {
    document.body.scrollTop = 0;// For Safari
    document.documentElement.scrollTop = 0;// For Chrome, Firefox, IE and Opera
  }

  commentIsActive() {

  }

  showToastMessage(message:string, typeMess: string) {
    if(typeMess == 'success') {
      this.displaySuccessMess = true;
      this.mess = message;
      setTimeout(()=>{
        this.displaySuccessMess = false;
        window.location.reload();
        this.mess = '';
      },2000);
    }else if(typeMess == 'error') {
      this.displayErrorMess = true;
      this.mess = message;
      setTimeout(()=>{
        this.displayErrorMess = false;
        window.location.reload();
        this.mess = '';
      },2000);
    }
  }

  clickYES() {
    if(this.messQuestionType == 'commentInActive') {
      this.showToastMessage('Ẩn thành công', 'success');
      this.isShowComment = false;
    } else if(this.messQuestionType == 'commentActive') {
      this.showToastMessage('Hiện thành công', 'success');
      this.isShowComment = true;
    }

  }

}
