import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManageUsersComponent } from './manage-users-component/manage-users-component.component';
import { SurveyComponent } from './survey/survey.component';
import { UserDashboardComponent } from './UserDashboard/UserDashboard.component';
import { SurveyFillingComponent } from './SurveyFilling/SurveyFilling.component';
const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'admin-dashboard', component: ManageUsersComponent },
  // ... other routes
  { path: 'user-dashboard', component: UserDashboardComponent },
  {path: 'surveys', component: SurveyComponent},
  {path: 'answer-survey/:surveyId', component: SurveyFillingComponent}

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
// imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })

export class AppRoutingModule { }
