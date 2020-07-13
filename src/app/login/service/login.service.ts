import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from './../../common/message.service';
import { Login } from './../login';
import { Config } from './../../config';
import { Observable, of } from 'rxjs';
import { tap, catchError} from 'rxjs/operators';

const TOKEN = 'TOKEN';

@Injectable({
	providedIn: 'root'
})

export class LoginService {

	apiURL: string = Config.API_URL+"patientLogin/";

	constructor(public message:MessageService, private httpClient: HttpClient) { }
	
	public login(user): Observable<Login>{
		return this.httpClient.post<Login>(`${this.apiURL}`, user)
		.pipe(
			catchError(err=>{
				this.message.setMessage("sc", "", "", "Failed to log in: " + err.error.message);
				return of(null);
			}),
			tap(res =>{
				if(res){
					this.setToken(res.accessToken, res.userdata);
			  
					localStorage.removeItem('authentication');
					
					window.analytics.identify(localStorage.getItem('id'), {
						userId: res.userdata.id,
						role_id: res.userdata.role_id,
						clinic_id: res.userdata.clinic_id,
						treatment_id: res.userdata.tbl_treatment.id,
						template_id: res.userdata.tbl_treatment.template_id,
						therapist_id: res.userdata.tbl_treatment.pt_id
						  })
			  
					this.message.setMessage('sl', 'login', 'home/' + res.userdata.id);
			  
				}
			})
		)
	}

	public demoLogin(user): Observable<Login>{
		return this.httpClient.post<Login>(`${Config.API_URL+'demoPatientLogin/'}`, user)
		.pipe(
			catchError(err=>{
				this.message.setMessage("sc", "", "", "Failed to log in: " + err.error.message);
				return of(null);
			}),
			tap(res =>{
				if(res){
					this.setToken(res.accessToken, res.userdata);
			  
					localStorage.removeItem('authentication');
					
					window.analytics.identify(localStorage.getItem('id'), {
						userId: res.userdata.id,
						role_id: res.userdata.role_id,
						clinic_id: res.userdata.clinic_id,
						treatment_id: res.userdata.tbl_treatment.id,
						template_id: res.userdata.tbl_treatment.template_id,
						therapist_id: res.userdata.tbl_treatment.pt_id
						  })
			  
					this.message.setMessage('sl', 'login', 'home/' + res.userdata.id);
			  
				}
			})
		)
	}

	setToken(accessToken: string, user): void {

		localStorage.setItem(TOKEN, accessToken);
		
		localStorage.setItem('id', user.id);
		
		localStorage.setItem('username', user.name);
		
		localStorage.setItem('email', user.email);
		
		localStorage.setItem('role', user.role_id);

		localStorage.setItem('treatment_id', user.tbl_treatment.id);
		
		localStorage.setItem('template_id', user.tbl_treatment.template_id);

		localStorage.setItem('patient_id', user.tbl_treatment.patient_id);

		localStorage.setItem('week_day', user.tbl_treatment.week_day);

		localStorage.setItem('start_date', user.tbl_treatment.start_date);

		localStorage.setItem('therapist_id', user.tbl_treatment.pt_id);
	}

	isLogged() {

		return localStorage.getItem(TOKEN) != null;

	}

	logout() {

		this.httpClient.post(`${Config.API_URL}logout`, localStorage.getItem('email')).subscribe((res) => {
			
			[ TOKEN, 'id', 'email', 'username', 'role' ].forEach((k) => {
				localStorage.removeItem(k);
			});

		});

	}
}