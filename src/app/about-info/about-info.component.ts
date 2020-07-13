import { Component, OnInit, ElementRef } from '@angular/core';
import { InjuryInfoService } from '../about-info/service/injuryinfo.service';
import { CommonService } from './../common/common.service';
import { NgForm } from "@angular/forms";
import * as $ from 'jquery';
import mCustomScrollbar from 'malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar';

@Component({
	selector: 'app-about-info',
	templateUrl: './about-info.component.html',
	styleUrls: ['./about-info.component.css']
})
export class AboutInfoComponent implements OnInit {
	result : any = {};
	id: string;

	constructor(private elem: ElementRef, public common: CommonService, public injuryinfoService: InjuryInfoService) { }

	ngOnInit() {

		this.id = localStorage.getItem('id');

		this.getInjuryInfo();

		const pageName = this.elem.nativeElement.tagName.toLowerCase().replace('app-','');
		window.analytics.page(pageName, {"traits": localStorage.getItem('ajs_user_traits')});

	}

	getInjuryInfo(){
		this.injuryinfoService.injuryInfo_list().subscribe();
	}

}
