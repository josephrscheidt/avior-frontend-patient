import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataService } from './../../common/dataservice';
import { MessageService } from './../../common/message.service';
import { Config } from './../../config';
import { Observable, of } from 'rxjs';
import { tap, catchError} from 'rxjs/operators';

const TOKEN = 'TOKEN';

@Injectable({
	providedIn: 'root'
})

export class ProgramService extends DataService{

	apiURL: string = Config.API_URL+"exercise/";
	programs:any;


	constructor(public message:MessageService, private httpClient: HttpClient) { super() }
	
	public exercise_list() {
		if(this.checkExpiration('programs')){
			return of(null);
		}else{
			return this.httpClient.get(`${Config.API_URL}exercise/`+localStorage.getItem('id'))
			.pipe(
				catchError(err=>{
					this.message.initMessage();
					this.message.setMessage("sc", "", "", "Failed to Retrieve Home Exercise Program: " + err.error.message);
					return of(null);
				}),
				tap(res=>{if(res) { this.cache('programs', res); } })
			)
		}
	}
}