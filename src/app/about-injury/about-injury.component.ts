import { Component, OnInit, ElementRef } from '@angular/core';
import { InjuryService } from '../about-injury/service/injury.service';
import { CommonService } from './../common/common.service';
import { NgForm } from "@angular/forms";

@Component({
	selector: 'app-about-injury',
	templateUrl: './about-injury.component.html',
	styleUrls: ['./about-injury.component.css']
})
export class AboutInjuryComponent implements OnInit {

	result : any = {};

	injuries : any = [];

	didYouKnows : any = [];

	questions : any = [];

	id : string;

	constructor(private elem: ElementRef, public common: CommonService, public injuryService: InjuryService) { }

	ngOnInit() {

		this.id = localStorage.getItem('id');

		this.common.spinner.show();

		this.getInjury();

		const pageName = this.elem.nativeElement.tagName.toLowerCase().replace('app-','');
		window.analytics.page(pageName, {"traits": localStorage.getItem('ajs_user_traits')});
	}

	getInjury(){

		this.injuryService.injury_list().subscribe(res=>{
			this.common.removeLoader();
		});
	}

}
