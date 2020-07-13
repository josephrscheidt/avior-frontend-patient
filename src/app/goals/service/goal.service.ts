import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataService } from './../../common/dataservice';
import { MessageService } from './../../common/message.service';
import { CommonService } from './../../common/common.service';
import { Config } from './../../config';
import { Observable, of } from 'rxjs';
import { tap, catchError} from 'rxjs/operators';

const TOKEN = 'TOKEN';

@Injectable({
	providedIn: 'root'
})

export class GoalService extends DataService {

	apiURL: string = Config.API_URL+"goal/";

	// surveyData:any;
	goals:any;

	constructor(public common:CommonService, public message:MessageService, private httpClient: HttpClient) { super() }
	

	goal_add(data) {
		window.analytics.track("Goal Added", {
			user_id: localStorage.getItem("ajs_user_id"),
			traits: localStorage.getItem("ajs_user_traits"),
			goal: data.goal,
		  })
		return this.httpClient.post(`${Config.API_URL}goal`, data)
		.pipe(
			catchError(err=>{
				this.message.initMessage();
				this.message.setMessage("sc", "", "", "Failed to add Goal, Please Try Again");
				return of(null);
			}),
			tap(res=>{
				if(res){
					this.message.setMessage('sa', '', '');
					this.refresh();
				}
			})
		)
	}

	goal_update(id, data) {
		window.analytics.track("Goal Completed", {
			user_id: localStorage.getItem("ajs_user_id"),
			traits: localStorage.getItem("ajs_user_traits"),
			goal_id: id,
		  })
		return this.httpClient.put(`${Config.API_URL}goal/`+id, data)
		.pipe(
			catchError(err=>{
				this.message.initMessage();
				this.message.setMessage("sc", "", "", "Failed to Update Goal, Please Try Again");
				return of(null);
			}),
			tap(res=>{if(res){this.refresh(); } })
		)
	}

	goal_list() {
		if(this.checkExpiration('goals')){
			return of(null);
		}else{
			return this.httpClient.post(`${Config.API_URL}goal/`+localStorage.getItem('treatment_id'), {})
			.pipe(
				catchError(err=>{
					this.message.initMessage();
					this.message.setMessage("sc", "", "", "Failed to Retrieve Goals: " + err.error.message);
					return of(null);
				}),
				tap(res=>{if(res) { this.cache('goals', res); } })
			)
		}
	}

	// patient_pain(treatment_id,data) {
	// 	return this.httpClient.post(`${Config.API_URL}patient-pain/`+treatment_id,data)
	// 	.pipe(
	// 		catchError(err =>{
	// 			this.message.initMessage();
	// 			this.message.setMessage("sc", "", "", "Failed to Update Pain: " + err.error.message);
	// 			return of(null);
	// 		})
	// 	)
	// }

	// fun_survey(template_id) {
	// 	if(this.checkExpiration('surveyData')) {
	// 		return of(null);
	// 	}else{
	// 		return this.httpClient.get(`${Config.API_URL}get-survey/${template_id}`)
	// 		.pipe(
	// 			catchError(err =>{
	// 				this.message.initMessage();
	// 				this.message.setMessage("sc", "", "", "Failed to get Functional Survey: " + err.error.message);
	// 				return of(null);
	// 			}),
	// 			tap(res=> {
	// 				if(res) {
	// 					this.cache('surveyData', res); 
	// 					localStorage.setItem('survey_id', res.id);
	// 				} 
	// 			})
	// 		)}
	// }

	// fun_surveyData(data) {
	//  return this.httpClient.post(`${Config.API_URL}add-survey/`,data)
	//  .pipe(
	// 	 catchError(err=>{
	// 		 this.message.setMessage("sc", "", "", "Failed to submit survey: " + err.error.message );
	// 		 return of(null);
	// 	 }),
	// 	 tap(res=>{
	// 		 if(res){
	// 			 sessionStorage.setItem('functionAsk', "0");
	// 			 this.message.setMessage('sl', 'login', 'home/' + data.patient_id);
	// 		 }
	// 	 })
	//  )
	// }
	
  }

 