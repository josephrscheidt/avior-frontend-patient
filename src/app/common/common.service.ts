import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup } from '@angular/forms';

@Injectable({
	providedIn: 'root'
})
export class CommonService {

	constructor(private sanitizer: DomSanitizer, private route: ActivatedRoute, private router: Router,public spinner: NgxSpinnerService) { }

	emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

	passwordRegEx = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*]?)[a-zA-Z0-9!@#$%^&*]{6,12}$/;

	theHtmlString : SafeHtml;

	showTr : boolean = true;

	responseMessage : boolean = false;

	response : any;

	responseType : string = 'success';

	mode : string = 'Add';

	buttoneMode : string = 'Add';

	private sub: any;

	id: number;

	home_url :  string;

	isActiveDiv : boolean = true;

	addLoaderRow(colspan){
		this.theHtmlString =  this.sanitizer.bypassSecurityTrustHtml("<td colspan = '"+colspan+"'><div class = 'h3 text-center'>Loading...</div></td>");
	}

	hideLoaderRow(){
		this.theHtmlString = '';
		this.showTr = false;
	}

	checkForEditable( route, editMethod, resetMethod){
		this.isActiveDiv = false;
		this.responseMessage = false;
		this.response = '';
		this.responseType = 'warning';

		this.sub = route.params.subscribe(params => {
			this.id = +params['id']; // (+) converts string 'id' to a number

			// In a real app: dispatch action to load the details here.
			if(this.id){
				editMethod(this.id);
				this.setMode('Edit');
			}else{
				resetMethod();
				this.setMode('Add');
			}
		});
		this.isActiveDiv = true;
	}

	setMode(type) {
		if(type == 'Edit'){
			this.mode = 'Edit';
			this.buttoneMode = 'Update';
		}else{
			this.mode = 'Add';
			this.buttoneMode = 'Add';
		}
	}

	initMessage() {
		this.responseMessage = true;
		this.responseType = 'warning';
		this.isActiveDiv = false;
	}

	resetMessage(route = '', speed = 1500) {

		setTimeout(() => {

			this.responseMessage = false;

			this.responseType = 'warning';

			this.isActiveDiv = true;

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
			this.response = 'Password Successfully Reset';
			this.resetMessage(route);
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

	titleCaseWord(word: string) {
		if (!word) return word;
		return word[0].toUpperCase() + word.substr(1).toLowerCase();
	}

	removeLoader(time = 2000){
		setTimeout(() => {
			this.spinner.hide();
		}, time);
	}

	formatDate(date) {

		var d = new Date(date),
		month = '' + (d.getMonth() + 1),
		day = '' + d.getDate(),
		year = d.getFullYear();

		if (month.length < 2) month = '0' + month;
		if (day.length < 2) day = '0' + day;
		//return only MM-DD
		return [month, day].join('-');
	}

	checkPasswords(group: FormGroup) { // here we have the 'passwords' group
	let pass = group.get('newPassword').value;
	let confirmPass = group.get('repeatPassword').value;

	return pass === confirmPass ? null : { notSame: true }     
	}


}
