import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GoalService } from '../goals/service/goal.service';
import { CommonService } from './../common/common.service';
import { MessageService } from './../common/message.service';
import { NgForm } from "@angular/forms";
import * as Chart from 'chart.js'

declare var $: any;


@Component({
	selector: 'app-goals',
	templateUrl: './goals.component.html',
	styleUrls: ['./goals.component.css']
})
export class GoalsComponent implements OnInit {

	goal_id;
	showSetYourGoal: boolean = true;
	model: any = {};
	result: any = {};
	pendingGoals: any = [];
	doneGoals: any = [];
	canvas: any;
	points: any = [];
	labels: any = [];
	id : string;

	@ViewChild('cancel') cancel: ElementRef;
	@ViewChild('completeModal') completeModal: ElementRef;

	constructor(public message:MessageService, private elem: ElementRef, public common: CommonService, public goalService: GoalService) { }

	ngOnInit() {

		this.id = localStorage.getItem('id');

		this.common.spinner.show();

		this.getGoals();

		this.common.removeLoader();

		const pageName = this.elem.nativeElement.tagName.toLowerCase().replace('app-','');
		window.analytics.page(pageName, {"traits": localStorage.getItem('ajs_user_traits')});

	}

	getGoals() {
		this.showSetYourGoal = true;
		this.pendingGoals = [];
		this.doneGoals = [];
		var goals;
		this.goalService.goal_list().subscribe((res: any) => {
			if(!res) {
				this.goalService.goals.subscribe(res =>{
					goals = res;
				})
			}else{
				goals = res;
			}

			let dates = [];

			let counts = {};

			for (let k of goals) {


				if (k.status == 0) {
					this.pendingGoals.push(k);
				} else {
					dates.push(this.common.formatDate(k.updatedAt));
					this.doneGoals.push(k);
				}
			}
			let count = 0;
			$.each(dates, function (key, value) {
				count++;
				if (!counts.hasOwnProperty(value)) {
					counts[value] = count;
				} else {
					counts[value] = count;
				}
			});

			//I need to walk through this logic
			this.labels = Object.keys(counts);

			this.points = Object.values(counts);

			if (Object.keys(this.pendingGoals).length > 0) {
				this.showSetYourGoal = false;
			}

			//what happens if we remove this if condition
			//we want to show the empty graph when there is nothing to show instead of the message "there is not enough datat to display graph"
			// if (this.points.length) {

				this.goalChart();
				// }

			});
	}

	addGoal() {

		this.goalService.goal_update(this.goal_id, { 'status': '1' }).subscribe((res) => {

			this.getGoals();

		});
	}

	onSubmit(form?: NgForm) {

		let goal = form.value;

		goal.treatment_id = localStorage.getItem('treatment_id');

		goal.patient_id = localStorage.getItem('id');

		this.message.initMessage();

		this.message.setMessage('l');

		this.goalService.goal_add(goal).subscribe((res) => {

			form.reset();

			this.getGoals();

			$(this.completeModal.nativeElement).modal('hide');

		});

	}

	goalChart() {

		let canvas: any = document.getElementById('goalchart') as HTMLElement;

		let max = 25;

		if(this.points.length){
			max = Math.max(...this.points);
			if(max < 25){
				max = 25;
			}
		}else{
			this.labels.push(this.common.formatDate(new Date().toJSON().slice(0,10)));
		}

		new Chart(canvas, {

			type: 'line',
			data: {
				labels: this.labels,
				datasets: [{
					yAxisID: 'A',
					borderColor: '#FFF',
					borderWidth: 5,
					fill: false,
					pointBackgroundColor: "#FFF",
					pointRadius: 5,
					data: this.points,
				}]
			},
			options: {
				legend: {
					display: false,
					labels: {
						fontColor: '#ffffff'
					}
				},
				scales: {
					xAxes: [{
						gridLines: {
							drawOnChartArea: false,
							color: "rgba(255, 255, 255, 0.25)"
						},
						ticks: {
							fontColor: "rgba(255, 255, 255, 0.75)", // this here
							fontSize: 16
						},
					}],
					yAxes: [{
						gridLines: {
							color: "rgba(255, 255, 255, 0.25)"
						},
						id: 'A',
						type: 'linear',
						position: 'left',
						ticks: {
							fontColor: "#fff",
							fontSize: 16,
							max: max,
							min: 0,
							stepSize: max/5
						}
					}]
				}
			}

		});

	}

}
