import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent }      from './signup/signup.component';
import { LayoutComponent } from './layout/layout.component';
import { AboutInfoComponent } from './about-info/about-info.component';
import { AboutInjuryComponent } from './about-injury/about-injury.component';
import { RoadmapComponent } from './roadmap/roadmap.component';
import { SplashComponent } from './splash/splash.component';
import { HomeComponent } from './home/home.component';
import { GoalsComponent } from './goals/goals.component';
import { ProgramComponent } from './program/program.component';
import { FunctionalSurveyComponent } from './functional-survey/functional-survey.component';
import { ProgramDetailComponent } from './program/program-detail/program-detail.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './forgot-password/reset-password/reset-password.component';
import { AuthGuard } from './guards/auth-guard.service';


const routes: Routes = [

  { path: '', redirectTo: '/splash', pathMatch: 'full' },
  { path: 'splash', component: SplashComponent, pathMatch: 'full' },
  { path: 'signup', component: SignupComponent, pathMatch: 'full' },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  {
    path: 'home',
    component: LayoutComponent,
    children: [
      { path: ':id', component: HomeComponent, pathMatch: 'full'}
    ],
    canActivate: [AuthGuard]
  },
  {
    path: 'about-info',
    component: LayoutComponent,
    children: [
      { path: ':id', component: AboutInfoComponent, pathMatch: 'full' }
    ]
  },
  {
    path: 'about-injury',
    component: LayoutComponent,
    children: [
      { path: ':id', component: AboutInjuryComponent, pathMatch: 'full' }
    ]
  },
  {
    path: 'roadmap',
    component: LayoutComponent,
    children: [
      { path: ':id', component: RoadmapComponent, pathMatch: 'full' }
    ]
  },
  {
    path: 'goals',
    component: LayoutComponent,
    children: [
      { path: ':id', component: GoalsComponent, pathMatch: 'full' }
    ]
  },
  {
    path: 'program',
    component: LayoutComponent,
    children: [
      { path: ':id', component: ProgramComponent, pathMatch: 'full' },
      { path: ':id/program-detail/:exercise_id/:treatment_id', component: ProgramDetailComponent },
      { path: ':id/program-detail', component: ProgramDetailComponent },


    ]
  },

  {
    path: 'functional-survey',
    component: LayoutComponent,
    children: [
      { path: ':id', component: FunctionalSurveyComponent, pathMatch: 'full' },
    ]
  },

  // {
  //   path: 'home',
  //   component: LayoutComponent,
  //   children: [
  //     { path: '', component: HomeComponent, pathMatch: 'full' }
  //   ]
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
