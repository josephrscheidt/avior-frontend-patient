import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ProgramService } from '../program/service/program.service';
import { CommonService } from './../common/common.service';
import { MessageService } from './../common/message.service';
import { HomeService } from '../home/service/home.service';
import { NgForm } from "@angular/forms";
import ProgressBar from 'progressbar.js/dist/progressbar.min.js';
import * as Chart from 'chart.js'

declare var $ :any;


@Component({
  selector: 'app-program',
  templateUrl: './program.component.html',
  styleUrls: ['./program.component.css']
})
export class ProgramComponent implements OnInit {

  result : any = {};
  programs : any = [];
  newProgress:any;
  progress : any;
  today: any;
  data  : any= localStorage.getItem('week_day');
  isCurrentDate:boolean = false;
  id : string;

  @ViewChild('todayModal') todayModal:ElementRef;

  constructor(public message:MessageService, private elem: ElementRef, public common: CommonService, public programService: ProgramService,public homeService: HomeService) { }

  ngOnInit() {
    this.common.spinner.show();
    this.getProgram();
    this.countHep();
    this.id = localStorage.getItem('id');

    const pageName = this.elem.nativeElement.tagName.toLowerCase().replace('app-','');
		window.analytics.page(pageName, {"traits": localStorage.getItem('ajs_user_traits')});

  }

  getProgram(){

    this.programService.exercise_list().subscribe(res =>{
      this.common.removeLoader();
    });
  }

  drawProgressBar(){

    $('#progress').html('');
    var progressBar =
    new ProgressBar.Circle('#progress', {
      color: '#0392CF',
      strokeWidth: 2,
      duration: 2000, // milliseconds
      easing: 'easeInOut'
    });

    progressBar.animate(this.progress);// percent
  }

  myFunc(){

    this.homeService.home_hep({'treatment_id':localStorage.getItem('treatment_id'),'patient_id':localStorage.getItem('patient_id')}).subscribe((res)=>{

      this.progress = +this.progress + +this.newProgress;
      if ( this.progress > 1 ) {
        this.progress = 1.0;
      }

      $(this.todayModal.nativeElement).modal('show');

      this.drawProgressBar();
      this.countHep();

    });
  }


  countHep(){
    this.today = new Date(Date.now()).toISOString().substring(0,10);
    this.homeService.hep_count().subscribe((res: any)=>{
      if ( Object.keys(res).length > 0 ) {
        let hep_date = new Date(res[(Object.keys(res).length)-1]['hep_date']).toISOString().substring(0,10);
        if ( this.today == hep_date ) {
          this.isCurrentDate = true;
        }else{
          this.isCurrentDate = false;
        }
      }

    });
  }

}
