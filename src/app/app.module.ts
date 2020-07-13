import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AboutInfoComponent } from './about-info/about-info.component';
import { LayoutComponent } from './layout/layout.component';
import { AboutInjuryComponent } from './about-injury/about-injury.component';
import { RoadmapComponent } from './roadmap/roadmap.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { SplashComponent } from './splash/splash.component';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuard } from './guards/auth-guard.service';
import { GoalsComponent } from './goals/goals.component';
import { ProgramComponent } from './program/program.component';
import { ProgramDetailComponent } from './program/program-detail/program-detail.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './forgot-password/reset-password/reset-password.component';
import { FunctionalSurveyComponent } from './functional-survey/functional-survey.component';

import { NgxSpinnerModule } from 'ngx-spinner';
import { MatIconRegistry, MatInputModule, MatButtonModule, MatSelectModule, MatIconModule, MatDatepickerModule, MatRadioModule } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


declare global {
  interface Window { analytics: any; }
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    AboutInfoComponent,
    LayoutComponent,
    AboutInjuryComponent,
    RoadmapComponent,
    FooterComponent,
    HeaderComponent,
    SplashComponent,
    HomeComponent,
    GoalsComponent,
    ProgramComponent,
    ProgramDetailComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    FunctionalSurveyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    MalihuScrollbarModule.forRoot(),
    NgxSpinnerModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    BrowserAnimationsModule,
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer){
    matIconRegistry.addSvgIconSet(domSanitizer.bypassSecurityTrustResourceUrl('./assets/mdi.svg'));
 }
}
