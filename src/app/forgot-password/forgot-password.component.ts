import { Component, OnInit } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, FormArray, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonService } from '../common/common.service';
import { MessageService } from './../common/message.service';
import { ForgotPasswordService } from './service/forgot-password.service';

@Component({
	selector: 'app-forgot-password',
	templateUrl: './forgot-password.component.html',
	styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

	forgotPasswordForm : FormGroup;
	
	submitted : boolean = false;

	constructor(public message:MessageService, public fb: FormBuilder, public common: CommonService, public forgotPasswordService: ForgotPasswordService) { }

	ngOnInit() {
		
		function resize() {
			const heights = window.innerHeight;
			document.getElementById('login_bg').style.height = heights + 'px';
		}
		resize();

		window.onresize = function () {
			resize();
		};
		this.setForgotPasswordForm();

	}

	get fpf(){ return this.forgotPasswordForm.controls; }

	setForgotPasswordForm(){
		let email = localStorage.getItem('rest_email');
		this.forgotPasswordForm = this.fb.group({
			email : [email, [Validators.required, Validators.pattern(this.common.emailRegEx)]]
		});
	}

	onSubmit(){
		this.submitted = true;
		
		// stop here if form is invalid
		if (this.forgotPasswordForm.invalid) {
			return;
		}

		this.message.initMessage();

		this.message.setMessage('fr');

		this.forgotPasswordService.sendEmail(this.forgotPasswordForm.value).subscribe((res)=> {


			localStorage.setItem('rest_email', this.forgotPasswordForm.controls['email'].value);

		});
	}
}
