import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { ProgramdetailService } from '../program-detail/service/program-detail.service';
import { CommonService } from './../../common/common.service';
import { MessageService } from './../../common/message.service';
import { NgForm } from "@angular/forms";
import * as $ from 'jquery';


@Component({
	selector: 'app-program-detail',
	templateUrl: './program-detail.component.html',
	styleUrls: ['./program-detail.component.css']
})
export class ProgramDetailComponent implements OnInit {

	exercise_data : any = [];
	constructor(public message:MessageService, private route: ActivatedRoute, public common: CommonService, public programdetailService: ProgramdetailService) { }

	exercise_id: any;
	treatment_id: any;
	exercise: any = {};
	id : string;

	ngOnInit() {
		this.common.spinner.show();
		this.exercise_id = this.route.snapshot.paramMap.get("exercise_id");
		this.treatment_id = this.route.snapshot.paramMap.get("treatment_id");
		this.getExecise();
		this.id = localStorage.getItem('id');
	}


	getExecise(){

		this.programdetailService.exercise_detail(this.exercise_id, this.treatment_id).subscribe((res:any)=>{

			this.exercise_data = res;

			this.exercise = this.exercise_data.tbl_exercise;

			this.common.removeLoader();

		});
	}

}
