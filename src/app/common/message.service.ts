import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from './common.service';

@Injectable({
	providedIn: 'root'
})
export class MessageService {

	constructor(public common:CommonService, private sanitizer: DomSanitizer, private route: ActivatedRoute, private router: Router,public spinner: NgxSpinnerService) { }

	showTr : boolean = true;

	responseMessage : boolean = false;

	response : any;

	responseType : string = 'success';

    id: number;
    
    home_url :  string;

	initMessage() {
		this.responseMessage = true;
		this.responseType = 'warning';
		this.common.isActiveDiv = false;
	}

	resetMessage(route = '', speed = 3000) {

		setTimeout(() => {

			this.responseMessage = false;

			this.responseType = 'warning';

			this.common.isActiveDiv = true;

			if(route === 'reset_password'){
				this.home_url = '../home/' + localStorage.getItem('id');
				this.router.navigate([this.home_url], {relativeTo: this.route });
			}

			if(route =='resend_vc') {
				this.router.navigate(['../forgot-password'], {relativeTo: this.route });
			}
			
			if(route !== '' && route !== 'reset_password' && route !== 'resend_vc'){
				this.router.navigateByUrl('/'+route);
			}

		},speed);

	}
	setMessage(type, content = '', route = '', custom = '') {

		this.responseType = 'success';

		switch (type) {
			case "a":
			this.response = 'Adding '+content+', Please Wait';
			break;

			case "l":
			this.response = 'Logging In, Please Wait';
			break;

			case "sl":
			this.response = 'Successfully Logged In';
			this.resetMessage(route);
			break;

			case "n":
			this.response = 'Creating account. Please wait';
			break;

			case "sn":
			this.response = 'Account created successfully. Please verify your account first to login';
			this.resetMessage(route);
			break;

			case "u":
			this.response = 'Updating '+content+', Please Wait';
			break;

			case "sc":
			this.responseType = 'danger';
			this.response = custom;
			this.resetMessage(route);
			break;

			case "fr":
			this.response = 'Generating password reset request. Please wait!';
			break;

			case "fs":
			this.response = 'We have sent a Verification Code to the given email.';
			this.resetMessage(route);
			break;

			case "rp":
			this.response = 'Setting up new Password. Please wait';
			break;

			case "rps":
			this.response = 'Successfully Updated!';
			this.resetMessage(route, 60000);
			break;

			case "sa":
			this.response = 'Successfully Added!';
			this.resetMessage(route);
			break;

			case "su":
			this.response = 'Successfully Updated!';
			this.resetMessage(route);
			break;

			default:
			this.responseType = 'danger';
			this.response = 'Something went wrong. Please try again.';
			this.resetMessage(route);
			break;
		}
	}

}
