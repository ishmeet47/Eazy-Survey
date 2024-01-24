import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ManageUsersComponent } from './manage-users-component/manage-users-component.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { NgxBootstrapIconsModule, allIcons } from 'ngx-bootstrap-icons';
import { SurveyService } from './services/survey.service';
import { ButtonComponent } from './components/button/button.component';
import { AlertModule } from 'ngx-bootstrap/alert';
// import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { SurveyResultsChartComponent } from './survey-results-chart/survey-results-chart.component';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';
// import { NgXClickOutsideModule } from 'ngx-click-outside';
import { ClickOutsideDirective } from './directives/ClickOutsideDirective';

import { DateValidatorDirective } from './directives/date-validator.directive';
import { UserAnswerService } from './services/userAnswer.service';
import { AdminGroupsComponent } from './admin/admin-groups/admin-groups.component';
import { AdminSurveysComponent } from './admin/admin-surveys/admin-surveys.component';
import { AdminUsersComponent } from './admin/admin-users/admin-users.component';
import { AdminNavbarComponent } from './admin/admin-layout/admin-navbar/admin-navbar.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { FilterableTableComponent } from './components/filterable-table/filterable-table.component';
import { FilterableDropdownComponent } from './components/filterable-dropdown/filterable-dropdown.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserDashboardComponent } from './user/user-dashboard/user-dashboard.component';
import { UserLayoutComponent } from './user/user-layout/user-layout.component';
import { UserNavbarComponent } from './user/user-layout/user-navbar/user-navbar.component';
import { CardComponent } from './components/card/card.component';
import { UserSurveyComponent } from './user/user-survey/user-survey.component';
import { NgbAlertModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ManageUsersComponent,
    ButtonComponent,
    SurveyResultsChartComponent,
    ClickOutsideDirective,
    DateValidatorDirective,
    UserDashboardComponent,
    AdminNavbarComponent,
    AdminGroupsComponent,
    AdminSurveysComponent,
    AdminUsersComponent,
    AdminLayoutComponent,
    FilterableTableComponent,
    FilterableDropdownComponent,
    UserLayoutComponent,
    UserNavbarComponent,
    UserSurveyComponent,
    CardComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxBootstrapIconsModule.pick(allIcons),
    AlertModule,
    BsDropdownModule.forRoot(),
    NgbAlertModule,
    NgbModule,
    NgApexchartsModule,
  ],
  providers: [
    SurveyService,
    UserAnswerService,
    HttpClientModule,
    SurveyService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
