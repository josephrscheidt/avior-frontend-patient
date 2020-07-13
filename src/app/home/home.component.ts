import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { HomeService } from './service/home.service';
import { CommonService } from './../common/common.service';
import { MessageService } from './../common/message.service';
import { GoalService } from '../goals/service/goal.service';
//import * as $ from 'jquery';
import ProgressBar from 'progressbar.js/dist/progressbar.min.js';
import * as Chart from 'chart.js'
//import * as bootstrap from "bootstrap";
declare var $ :any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [HomeService]

})
export class HomeComponent implements OnInit {

  model : any = {};
  result : any = {};
  pendingGoals : any = [];
  showSetYourGoal: boolean = true;
  showSetYourRate: boolean = true;
  setHep: boolean = true;
  goal_id;
  treatment_id;
  patient_id;
  size;
  canvas: any;
  today: any;
  today1: any;
  one_week = 1000 * 60 * 60 * 24 * 7;
  two_weeks = this.one_week * 2;
  three_weeks = this.one_week * 3;
  five_weeks = this.one_week * 5;
  differenceInTime:number;

  data = localStorage.getItem('week_day') || 0;

  progress : any=0;

  pain_level: any = [
  {'id': '0', 'display': '0', 'status': true, 'class': 'one'},
  {'id': '1', 'display': '1', 'status': true, 'class': 'two'},
  {'id': '2', 'display': '2', 'status': true, 'class': 'three'},
  {'id': '3', 'display': '3', 'status': true, 'class': 'four'},
  {'id': '4', 'display': '4', 'status': true, 'class': 'five'},
  {'id': '5', 'display': '5', 'status': true, 'class': 'six'},
  {'id': '6', 'display': '6', 'status': true, 'class': 'seven'},
  {'id': '7', 'display': '7', 'status': true, 'class': 'eight'},
  {'id': '8', 'display': '8', 'status': true, 'class': 'nine'},
  {'id': '9', 'display': '9', 'status': true, 'class': 'ten'},
  {'id': '10', 'display': '10', 'status': true, 'class': 'eleven'},
  ];

  @ViewChild('cancel') cancel: ElementRef;
  @ViewChild('chart') chart: ElementRef;
  @ViewChild('todayModal') todayModal:ElementRef;
  @ViewChild('weeklyModal') weeklyModal:ElementRef;
  @ViewChild('completeModal') completeModal: ElementRef;
  @ViewChild('goalModal') goalModal: ElementRef;
  @ViewChild('goalCompleteModal') goalCompleteModal: ElementRef;
  @ViewChild('reviewModal') reviewModal: ElementRef;


  week_day:any = localStorage.getItem('week_day');
  achieved:any = 1;
  newProgress:any;
  pain : any = [];
  isCurrentDate:boolean = false;
  isFunctional:boolean = true;
  isCurrentDatePain = 0;
  isFunctionAsk = 0;
  // isFunctionAsk:boolean = true;
  goalName: string = '';
  showGraph: boolean = false;
  // showGraph: boolean = true;
  painData: any;
  showGoogleReview: boolean = false;
  googleReviewLink: string ;
  patient_info: any = {};
  patient: any = {};
  clinic : any = {};
  clinic_name: String;
  constructor(public message:MessageService, private elem: ElementRef, public common: CommonService, public goalService: GoalService, public homeService: HomeService) { }

  ngOnInit() {

    this.patient_id = localStorage.getItem('patient_id');

    this.common.spinner.show();

    // this.showSetYourRate = true;
    // Initially, set the progress chart to 0px
    $('.pain_level_box').css({height: '0px'});

    this.homeService.home_rate().subscribe((res: any)=>{
      this.painData = res;

      this.isCurrentDatePain = +this.painData.painAsk;

      this.isFunctionAsk = +this.painData.functionAsk;


      if (!this.isCurrentDatePain) { this.painChart();}
    });

    this.getGoals();
    this.newProgress  = (((this.achieved * 100)/this.week_day) /100);
    this.progress = 0;
    this.chartLoad();
    this.countHep();
    this.common.removeLoader();

    const pageName = this.elem.nativeElement.tagName.toLowerCase().replace('app-','');
		window.analytics.page(pageName, {"traits": localStorage.getItem('ajs_user_traits')});

  }

  ngAfterViewInit() {
    this.homeService.getPatient(parseInt(localStorage.getItem('patient_id'))).subscribe((res) => {
          this.patient = res;
          let startTime = Date.parse(this.patient.createdAt);
          let currentTime = Date.now();
          this.differenceInTime = currentTime - startTime;
          
          if(!+localStorage.getItem('reviewed')){
            localStorage.setItem('reviewed', this.patient.filled_out_review);
          }

          if ((!+localStorage.getItem('reviewed')) && (this.differenceInTime > this.two_weeks)){

            this.homeService.getClinic(this.patient.clinic_id).subscribe((res) =>{
                this.clinic = res;
                if ((this.clinic.google_review_link == null)) {
                } else {
                this.googleReviewLink = this.clinic.google_review_link;
                this.clinic_name = this.clinic.clinic_name;
                localStorage.setItem('reviewed', "1");
                $(this.reviewModal.nativeElement).modal('show');}
                });
          }
        });
  }

  hideReviewPopUp(){
    this.patient.filled_out_review = 1;
    this.homeService.updatePatient(this.patient,parseInt(localStorage.getItem('patient_id'))).subscribe();
    window.analytics.track("Google Review", {
			user_id: localStorage.getItem("ajs_user_id"),
			traits: localStorage.getItem("ajs_user_traits"),
		  })
    $(this.reviewModal.nativeElement).modal('hide');
  }

  rejectReview(){
    this.patient.filled_out_review = 1;
    this.homeService.updatePatient(this.patient,parseInt(localStorage.getItem('patient_id'))).subscribe();
    window.analytics.track("Rejected Review", {
			user_id: localStorage.getItem("ajs_user_id"),
			traits: localStorage.getItem("ajs_user_traits"),
		  })
    $(this.reviewModal.nativeElement).modal('hide');
  }

  chartLoad(){
    this.homeService.hep_count().subscribe((res: any)=>{
      if(res.length > 7){
        this.size = 7;
      }else{
        this.size = res.length;
      }

      this.progress = this.size * this.newProgress;
      if ( this.progress > 1 ) {
        this.progress = 1.0;
      }
      this.drawProgressBar();

    });
  }

  setRating(i){
    this.isFunctional = true;
    setTimeout(() => {
      this.painChart();
    }, 1);

    let treatment_id=localStorage.getItem('treatment_id')
    this.homeService.patient_pain(treatment_id,{'treatmentstartdate':localStorage.getItem('start_date'),'treatment_id':localStorage.getItem('treatment_id'),'q1':this.pain_level[i].id }).subscribe((res:any)=>{

      let j = 0;
      for(let pain of this.pain_level){
        if ( pain.id <= i ) {
          this.pain_level[j]['status'] = true;
        } else {
          this.pain_level[j]['status'] = false;
        }
        j++;
      }

      this.isCurrentDatePain = 0;

      sessionStorage.setItem('painAsk', "0");

      // this.isFunctionAsk = (this.isFunctionAsk1) ? true : false;

      localStorage.setItem('week', res.week);

      this.painChart();

    });

  }

  getGoals(){
    this.showSetYourGoal = true;
    this.pendingGoals = [];
    var goals;
    this.goalService.goal_list().subscribe((res:any)=>{

      if(!res) {
				this.goalService.goals.subscribe(res =>{
					goals = res;
				})
			}else{
				goals = res;
			}

      for(let k of goals){
        if ( k.status == 0 ) {
          this.pendingGoals.push(k);
        }
      }

      if ( Object.keys(this.pendingGoals).length > 0 ) {
        this.showSetYourGoal = false;
      }

    });
  }

  onSubmit(form?:NgForm){

    let goal = form.value;

    goal.treatment_id = localStorage.getItem('treatment_id');

    goal.patient_id = localStorage.getItem('id');

    this.message.initMessage();

    this.message.setMessage('l');

    this.goalService.goal_add(goal).subscribe((res)=>{

      form.reset();
      this.getGoals();
      $(this.completeModal.nativeElement).modal('hide');
    });

  }

  gModal(name) {
    this.goalName = name;
    $(this.goalModal.nativeElement).modal('show');
  }

  addGoal(){

    this.goalService.goal_update(this.goal_id, {'status': '1'}).subscribe((res)=>{

      $(this.goalCompleteModal.nativeElement).modal('show');

      this.getGoals();

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

  painChart(){

    this.homeService.paingraphData().subscribe((res)=>{
      if(!res){
        this.homeService.pain.subscribe(res =>{
          this.pain = res;
        })
      }else{
        this.pain = res;
      }

      this.showGraph = true;
      $('.pain_level_box').css({height: 'auto'});
      let canvas :any = document.getElementById('chart') as HTMLElement;

      new Chart(canvas, {

        type: 'line',
        data: {
          labels: this.pain['weeks'],
          datasets: [{
            label: 'Interference',
            yAxisID: 'A',
            borderColor: '#FFD0FD',
            borderWidth: 5,
            fill: false,
            pointBackgroundColor: "#FFD0FD",
            pointRadius: 5,
            data: this.pain['pains'],
          }, {
            label: 'Function',
            yAxisID: 'B',
            borderColor: 'rgb(255,255,255)',
            borderWidth: 5,
            pointBackgroundColor: 'rgb(255,255,255)',
            pointRadius: 5,
            data: this.pain['functions'],
            spanGaps: true,
            fill: false
          }]
        },
        options: {
          maintainAspectRatio: false,
          plugins: {
            datalabels: {
              color: 'white',
              display: function(context) {
                return context.dataset.data[context.dataIndex] != "0";
              },
              font: {
                weight: 'bold'
              },
              formatter: Math.round
            }
          },
          legend: {
            display: false,
            labels: {
              fontColor: '#ffffff'
            }
          },
          scales: {
            xAxes: [{
              gridLines: {
                color: "transparent",
                display: true,
                drawBorder: false,
              },
              ticks: {
                fontColor: "rgba(255, 255, 255, 0.75)", // this here
                fontSize: 18
              },
            }],
            yAxes: [{
              gridLines: {
                color: "rgba(255, 255, 255, 0.5)"
              },
              id: 'A',
              type: 'linear',
              position: 'left',
              scaleLabel: {
                display: true,
                labelString: "DISCOMFORT",
                fontColor: "#FFD0FD",
                fontSize: 18
              },
              ticks: {
                fontColor: "#FFD0FD",
                fontSize: 18,
                max: 10,
                min: 0,
                stepSize: 5
              }
            }, {
              gridLines: {
                color: "rgba(255, 255, 255, 0.5)"
              },
              id: 'B',
              type: 'linear',
              position: 'right',
              scaleLabel: {
                display: true,
                labelString: "RECOVERY",
                fontColor: '#ffffff',
                fontSize: 18
              },
              ticks: {
                beginAtZero: false,
                fontColor: "#ffffff",
                fontSize: 18,
                max: 100,
                min: 0,
                stepSize: 50
              }
            }]
          }
        }
      });
      // Chart.defaults.global.plugins.datalabels.display = function(ctx) { return ctx.value !== 0; }
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

  myFunc(){

    this.homeService.home_hep({'treatment_id':localStorage.getItem('treatement_id'),'patient_id':localStorage.getItem('patient_id')}).subscribe((res)=>{

      this.progress = +this.progress + +this.newProgress;
      if ( this.progress > 1 ) {
        this.progress = 1.0;
      }
      if ( (this.size+1) == this.data ) {
        $(this.weeklyModal.nativeElement).modal('show');
      }

      if((this.size+1) !== this.data ) {
        $(this.todayModal.nativeElement).modal('show');
      }


      this.drawProgressBar();
      this.chartLoad();
      this.countHep();

    });
  }


}
