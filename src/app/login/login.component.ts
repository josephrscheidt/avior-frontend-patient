import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Login } from './login';
import { LoginService } from './service/login.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from './../common/common.service';
import { MessageService } from './../common/message.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  model : any = {};

  result : any = {};

  id: string;

  constructor(public message:MessageService, public loginService: LoginService,private route: ActivatedRoute, private router: Router, public common: CommonService) { }

  onSubmit(form?:NgForm){

    let user = form.value;

    this.message.initMessage();

    this.message.setMessage('l');

    this.loginService.login(user).subscribe();

  }

  ngOnInit() {

  // this.id = localStorage.getItem('id');
  // this.model.email = localStorage.getItem('rest_email');
  // this.model.password = localStorage.getItem('authentication');

    function resize() {
      const heights = window.innerHeight;
      if(document.getElementById('login_bg')){
        document.getElementById('login_bg').style.height = heights + 'px';
      }
    }
    resize();
    window.onresize = function () {
      resize();
    };

  }
}
