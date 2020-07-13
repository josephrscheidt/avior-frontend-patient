import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataService } from './../../common/dataservice';
import { MessageService } from './../../common/message.service';
import { Config } from './../../config';
import { Observable, of } from 'rxjs';
import { tap, catchError} from 'rxjs/operators';


@Injectable({
	providedIn: 'root'
})

export class HomeService extends DataService{

  apiClinicURL: string = Config.API_URL + "clinic/";
  apiPatientURL: string = Config.API_URL+"patient/";
  pain:any;
  surveyData:any;


  constructor(public message: MessageService, private httpClient: HttpClient){ super() }


  public getClinic(id: number){
		return this.httpClient.get(`${this.apiClinicURL}edit/${id}`);
	}

	public updatePatient(patient, patientId){

		return this.httpClient.put(`${this.apiPatientURL}${patientId}`, patient);
	}

  public getPatient(id: number){
		return this.httpClient.get(`${this.apiPatientURL}edit/${id}`);
	}

  public home_hep(data) {
		return this.httpClient.post(`${Config.API_URL}patient-hep/`,data)
		.pipe(
			catchError(err=>{
				this.message.initMessage();
				this.message.setMessage("sc", "", "", "Failed to Retrieve Progress Data: " + err.error.message);
				return of(null);
			})
		)
	}

  public hep_count() {
		let patient_id=localStorage.getItem('patient_id');
		let treatment_id=localStorage.getItem('treatment_id');
		return this.httpClient.get(`${Config.API_URL}get-patient-hep/${patient_id}/${treatment_id}`)
		.pipe(
			catchError(err=>{
				this.message.initMessage();
				this.message.setMessage("sc", "", "", "Failed to Retrieve Progress Data: " + err.error.message);
				return of(null);
			})
		)
	}

	public 	patient_pain(treatment_id,data) {
		return this.httpClient.post(`${Config.API_URL}patient-pain/`+treatment_id,data)
		.pipe(
			catchError(err =>{
				this.message.initMessage();
				this.message.setMessage("sc", "", "", "Failed to Update Pain: " + err.error.message);
				return of(null);
			}),
			tap(res=>{if(res) {this.refresh('pain'); } })
		)
	}

	public paingraphData() {
		if(this.checkExpiration('pain')){
			return of(null);
		}else{
			let treatment_id=localStorage.getItem('treatment_id');
			return this.httpClient.get(`${Config.API_URL}get-patient-graph/${treatment_id}`)
			.pipe(
				catchError(err=>{
					this.message.initMessage();
					this.message.setMessage("sc", "", "", "Failed to Retrieve Progress Data: " + err.error.message);
					return of(null);
				}),
				tap(res=>{
					if(res){
						this.cache('pain', res);
					}
				})
			)
		}
	}

	public 	fun_survey(template_id) {
		if(this.checkExpiration('surveyData')) {
			return of(null);
		}else{
			return this.httpClient.get(`${Config.API_URL}get-survey/${template_id}`)
			.pipe(
				catchError(err =>{
					this.message.initMessage();
					this.message.setMessage("sc", "", "", "Failed to get Functional Survey: " + err.error.message);
					return of(null);
				}),
				tap(res=> {
					if(res) {
						this.cache('surveyData', res); 
						localStorage.setItem('survey_id', res.id);
					} 
				})
			)}
	}

	public fun_surveyData(data) {
	 return this.httpClient.post(`${Config.API_URL}add-survey/`,data)
	 .pipe(
		 catchError(err=>{
			 this.message.setMessage("sc", "", "", "Failed to submit survey: " + err.error.message );
			 return of(null);
		 }),
		 tap(res=>{
			 if(res){
				 sessionStorage.setItem('functionAsk', "0");
				 this.message.setMessage('su', 'function', 'home/' + data.patient_id);
				 this.refresh('pain');
			 }
		 })
	 )
	}

  public home_rate() {
	  if(sessionStorage.getItem('painAsk') != undefined && sessionStorage.getItem('functionAsk') != undefined){
		  return of({painAsk: sessionStorage.getItem('painAsk'), functionAsk: sessionStorage.getItem('functionAsk')});
	  }else{
		let week=localStorage.getItem('week');
		let treatment_id=localStorage.getItem('treatment_id');
		let patient_id=localStorage.getItem('patient_id');
		return this.httpClient.get(`${Config.API_URL}get-pain-level/${patient_id}/${treatment_id}/${week}`)
		.pipe(
			catchError(err =>{
				this.message.initMessage();
				this.message.setMessage("sc", "", "", "Failed to Retrieve Progress Data: " + err.error.message);
				return of(null);
			}),
			tap(res =>{
				if(res){
					sessionStorage.setItem('painAsk', (res.painAsk)?"1":"0");
					sessionStorage.setItem('functionAsk', (res.functionAsk)?"1":"0");
				}
			})
		)
	  }
	}

}
