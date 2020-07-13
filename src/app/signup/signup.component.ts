import { Component, OnInit } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, FormArray, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

import { Signup } from './signup';
import { SignupService } from './service/signup.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from './../common/common.service';

@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
	model: any = {};

	signupForm: FormGroup;

	submitted = false;

	constructor( public signupService: SignupService, public fb: FormBuilder, private route: ActivatedRoute, private router: Router, public common: CommonService) { }

	ngOnInit() {

		function resize() {
      		const heights = window.innerHeight;
      		document.getElementById('sign_bg').style.height = heights + 'px';
    	}
    	resize();
    	window.onresize = function () {
      		resize();
    	};

		this.signupForm = this.fb.group({
			name: ['', Validators.required],
			email: ['', [Validators.required, Validators.email]],
			password: ['', Validators.required],
			contact_no: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
		});
	}

	get f() { return this.signupForm.controls; }

	onSubmit(){
		
		this.submitted = true;

		// stop here if form is invalid
		if (this.signupForm.invalid) {
			return;
		}

		let user = this.signupForm.value;

		user.role = '1';
		
		this.common.initMessage();
		
		this.common.setMessage('n');
		
		this.signupService.signUp(user).subscribe((res)=>{
			
			this.common.setMessage('sn', 'signup', 'login');

		}, (err) => {
			
			this.common.responseType = 'danger';
			
			this.common.response = err.error.message;

			this.common.resetMessage();
			
		});

	}

}
