import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ForgotPasswordService } from './../../forgot-password/service/forgot-password.service';
import { CommonService } from '../../common/common.service';
import { MessageService } from './../../common/message.service';
import { NgForm, FormBuilder, FormGroup, FormArray, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import mCustomScrollbar from 'malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar';
import ProgressBar from 'progressbar.js/dist/progressbar.min.js';
import * as Chart from 'chart.js'


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})

export class FooterComponent implements OnInit {

  resetPasswordForm: FormGroup;
  newPasswordForm: FormGroup;
  newPassword: string;
  submitted : boolean = false;
  submittedPassword : boolean = false;
  onKeyupCheck : boolean = false;
  passwordMatch: boolean = false;
  
  userName : any;
  id : string;
  constructor(public message:MessageService, public forgotPasswordService: ForgotPasswordService, public fb: FormBuilder, public common: CommonService) { }

	@ViewChild('closeChangePassword') closeChangePassword: ElementRef;

  ngOnInit() {

    this.id = localStorage.getItem('id');

    this.userName  = localStorage.getItem('username');
    $(document).ready(function () {
      $('#sidebar').mCustomScrollbar({
        theme: 'minimal'
      });
      $('#dismiss, .overlay').on('click', function () {
        // hide sidebar
        $('#sidebar').removeClass('active');
        // hide overlay
        $('.overlay').removeClass('active');
      });

      $('#sidebarCollapse').on('click', function () {
        // open sidebar
        $('#sidebar').addClass('active');
        // fade in the overlay
        $('.overlay').addClass('active');
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
      });
    });

    this.setNewPasswordForm();
  }

  get rpf(){ return this.resetPasswordForm.controls; }

  get npf(){ return this.newPasswordForm.controls; }

  onPasswordChange(ele){
		let v = ele.value
		let mat = v.match(this.common.passwordRegEx);
		this.onKeyupCheck = (!mat);
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


		this.forgotPasswordService.resetPassword(formData).subscribe( () => {
      setTimeout(()=>{
				this.closeChangePassword.nativeElement.click();
			},2000);
    });
  }
  
  onSubmitVerification(){

    this.message.initMessage();

		this.message.setMessage('fr');

		this.forgotPasswordService.sendEmail({email: this.resetPasswordForm.controls['email'].value}).subscribe((res)=> {

			localStorage.setItem('rest_email', this.resetPasswordForm.controls['email'].value);

		});
  }

  setResetPasswordForm(){
    this.passwordMatch = true;
		let email = localStorage.getItem('email');
		this.resetPasswordForm = this.fb.group({

			email : [{value: email, disabled : true}, [Validators.required, Validators.pattern(this.common.emailRegEx)]],
			password : [{value: this.newPassword, disabled: true}, [Validators.required, Validators.pattern(this.common.passwordRegEx)]],
			otp : ['', [Validators.required, Validators.pattern("^[0-9]*$")]]
		});
  }
  
  setNewPasswordForm(){
		this.newPasswordForm = new FormGroup({
			newPassword: new FormControl("", {validators: [Validators.required, Validators.pattern(this.common.passwordRegEx)], updateOn:'change'}),
			repeatPassword: new FormControl("", {validators: [Validators.required], updateOn: 'change'})
		}, this.common.checkPasswords);
  }
  onConfirmPassword(){
    this.submittedPassword = true;

		// stop here if form is invalid
		if (this.newPasswordForm.invalid) {
			return;
		}

		this.newPassword = this.newPasswordForm.get('newPassword').value;

		this.setResetPasswordForm();

	}

  }
