	import { Injectable } from '@angular/core';
	import { HttpClient, HttpHeaders } from '@angular/common/http';
	import { Config } from './../../../config';
	import { DataService } from './../../../common/dataservice';
	import { MessageService } from './../../../common/message.service';
	import { Observable, of } from 'rxjs';
	import { tap, catchError} from 'rxjs/operators';

	const TOKEN = 'TOKEN';

	@Injectable({
		providedIn: 'root'
	})

	export class ProgramdetailService extends DataService {

		apiURL: string = Config.API_URL+"exercise-detail/";
		exercise_data:any;
		exercise_array:any=[];

		constructor(public message:MessageService, private httpClient: HttpClient) { super() }
		
		 public exercise_detail(exercise_id, treatment_id) {
			 if(sessionStorage.getItem(`exercise_data.${exercise_id}`)!=undefined){
				 return of(JSON.parse(sessionStorage.getItem(`exercise_data.${exercise_id}`)));
			 }else{
				return this.httpClient.get(`${Config.API_URL}exercise-detail/`+exercise_id+`/`+treatment_id)
				.pipe(
					catchError(err=>{
						this.message.initMessage();
						this.message.setMessage("sc", "", "", "Failed to Retreive Exercise Details: " + err.error.message);
						return of(null);
					}),
					tap(res=>{
						if(res) {
							sessionStorage.setItem(`exercise_data.${exercise_id}`, JSON.stringify(res));
						} 
					})
				)
			 }
		}
	 }