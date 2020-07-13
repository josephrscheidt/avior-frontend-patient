import { Component, OnInit, ElementRef } from '@angular/core';
import { NgForm } from "@angular/forms";
import { MessageService } from './../common/message.service';
import { CommonService } from './../common/common.service';
import { HomeService } from '../home/service/home.service';

@Component({
  selector: 'app-functional-survey',
  templateUrl: './functional-survey.component.html',
  styleUrls: ['./functional-survey.component.css']
})
export class FunctionalSurveyComponent implements OnInit {

  surveyData : any= {};
  survey : any ;
  checked: boolean[] = [];
  arr3: any;
  id : string;

  constructor(public message:MessageService, private elem: ElementRef, public common: CommonService, public homeService: HomeService) { }

  ngOnInit() {
    this.common.spinner.show();
    this.functionalSurvey();
    this.id = localStorage.getItem('id');

    const pageName = this.elem.nativeElement.tagName.toLowerCase().replace('app-','');
		window.analytics.page(pageName, {"traits": localStorage.getItem('ajs_user_traits')});
  }

  functionalSurvey(){
    let template_id=localStorage.getItem('template_id');

    this.homeService.fun_survey(template_id).subscribe(res=>{
      this.common.removeLoader();
    });
  }


  onSubmit(){

    let  array3 : any = [ ...this.tempArr1, ...this.tempArr];

    this.message.initMessage();

    this.message.setMessage('u', 'Functional Progress');

    this.homeService.fun_surveyData({'survey_id':localStorage.getItem('survey_id'),'answers':array3 ,'patient_id':localStorage.getItem('patient_id')}).subscribe();

  }

  tempArr: any = [];
  tempArr1 : any = [];
  id_dict1 : any = {};


  //checkbox
  onChangeCategory1(event, item1: any){

    const checked = event.target.checked; // stored checked value true or false
    if (checked) {
      this.tempArr.push(item1.id); // push the Id in array if checked
    } else {
      const index = this.tempArr.findIndex(list => item1.id);//Find the index of stored id
      this.tempArr.splice(index, 1); // Then remove
    }
  }

  //radio
  onChangeCategory(event, item: any){ // Use appropriate model type instead of any

    //check to see if we already have an answer to this question
    if (item.survey_question_id in this.id_dict1) {
      // if so, remove old one and insert new selection
      const index = this.tempArr1.findIndex(list => this.id_dict1[item.survey_question_id]);
      this.tempArr1.splice(index, 1);
      this.id_dict1[item.survey_question_id] = item.id;
      this.tempArr1.push(item.id);
        } else {
          this.tempArr1.push(item.id);
          this.id_dict1[item.survey_question_id] = item.id;
        }
  }


}
