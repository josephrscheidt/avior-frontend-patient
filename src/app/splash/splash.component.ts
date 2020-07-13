import { Component, OnInit } from '@angular/core';
import { MessageService } from './../common/message.service';
import { LoginService } from '../login/service/login.service';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.css']
})
export class SplashComponent implements OnInit {

  constructor(public message:MessageService, public loginService:LoginService) { }

  onClick(){

    let user = {"email":"XXXXXXXXXXX", "password":"XXXXXXXXXXX"};

    this.message.initMessage();

    this.message.setMessage('l');

    this.loginService.demoLogin(user).subscribe();

  }

  ngOnInit() {
    function resize() {
      const heights = window.innerHeight;
      document.getElementById('login_bg').style.height = heights + 'px';
    }
    resize();
    window.onresize = function () {
      resize();
    };
  }

}
