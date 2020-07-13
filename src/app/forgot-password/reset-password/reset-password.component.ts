import { Component, OnInit } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, FormArray, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonService } from '../../common/common.service';
import { MessageService } from './../../common/message.service';
import { ForgotPasswordService } from './../service/forgot-password.service';

@Component({
	selector: 'app-reset-password',
	templateUrl: './reset-password.component.html',
	styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
	
	resetPasswordForm: FormGroup;

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

		this.setResetPasswordForm();
	}

	get rpf(){ return this.resetPasswordForm.controls; }

	setResetPasswordForm(){
		let email = localStorage.getItem('rest_email');
		this.resetPasswordForm = this.fb.group({

			email : [email, [Validators.required, Validators.pattern(this.common.emailRegEx)]],
			password : ['', [Validators.required, Validators.pattern(this.common.passwordRegEx)]],
			otp : ['', [Validators.required, Validators.pattern("^[0-9]*$")]]
		});
	}

	onSubmit(){
		this.submitted = true;

		// stop here if form is invalid
		if (this.resetPasswordForm.invalid) {
			return;
		}

		this.message.initMessage();

		this.message.setMessage('rp');
		
		let formData = {};

		for (const field in this.resetPasswordForm.controls) {

			switch (field) {

				case "otp" :
				formData["confirmationcode"] = this.resetPasswordForm.get(field).value;
				break;

				default:
				formData[field] = this.resetPasswordForm.get(field).value;
				break;

			}
		localStorage.setItem('authentication', formData['password']);
		}

		this.forgotPasswordService.resetPassword(formData).subscribe();
	}
	
}
