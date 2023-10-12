import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ManageUsersComponent } from './manage-users-component/manage-users-component.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './admin/admin-users/admin-users.component';
import { AdminSurveysComponent } from './admin/admin-surveys/admin-surveys.component';
import { AdminGroupsComponent } from './admin/admin-groups/admin-groups.component';
import { UserDashboardComponent } from './user/user-dashboard/user-dashboard.component';
import { UserSurveyComponent } from './user/user-survey/user-survey.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'admin/dashboard', component: AdminDashboardComponent },
  { path: 'admin/surveys', component: AdminSurveysComponent },
  { path: 'admin/groups', component: AdminGroupsComponent },
  { path: 'admin/users', component: AdminUsersComponent },
  { path: 'dashboard', component: UserDashboardComponent },
  { path: 'survey/:surveyId', component: UserSurveyComponent },
  { path: 'temp-admin-dashboard', component: ManageUsersComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
