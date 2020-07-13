import { Component, OnInit, ElementRef } from '@angular/core';
import { RoadmapService } from '../roadmap/service/roadmap.service';
import { CommonService } from './../common/common.service';
import { MessageService } from './../common/message.service';
import { NgForm } from "@angular/forms";
import * as $ from 'jquery';

@Component({
	selector: 'app-roadmap',
	templateUrl: './roadmap.component.html',
	styleUrls: ['./roadmap.component.css']
})
export class RoadmapComponent implements OnInit {

	result   : any = {};
	roadmaps : any = [];
	id : string;
	// romans   : any = ['I','II','III','IV','V'];
	romanNum : any = ["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"];
	// decimal number
	dNum : any = [1000,900,500,400,100,90,50,40,10,9,5,4,1];

	constructor(public message:MessageService, private elem: ElementRef, public common: CommonService, public roadmapService: RoadmapService) { }

	ngOnInit() {

		this.id = localStorage.getItem('id');
		this.common.spinner.show();
		this.getRoadmap();
		this.common.removeLoader();

		const pageName = this.elem.nativeElement.tagName.toLowerCase().replace('app-','');
		window.analytics.page(pageName, {"traits": localStorage.getItem('ajs_user_traits')});
	}

	getRoadmap(){

		this.roadmapService.roadmap_list().subscribe();
	}

	decimalRoman(value) {

		if (value <= 0 || value >= 4000)

			return value;

		let romanNumeral = "";

		for (var i = 0; i<this.romanNum.length; i++) {

			while (value >= this.dNum[i]) {

				value -= this.dNum[i];

				romanNumeral += this.romanNum[i];

			}

		}

		return romanNumeral;
	}
}
