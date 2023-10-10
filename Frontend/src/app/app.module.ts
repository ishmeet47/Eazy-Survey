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

import { UserDashboardComponent } from './UserDashboard/UserDashboard.component';
import { UserAnswerService } from './services/userAnswer.service';
import { SurveyFillingComponent } from './SurveyFilling/SurveyFilling.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminGroupsComponent } from './admin/admin-groups/admin-groups.component';
import { AdminSurveysComponent } from './admin/admin-surveys/admin-surveys.component';
import { AdminUsersComponent } from './admin/admin-users/admin-users.component';
import { AdminNavbarComponent } from './admin/admin-layout/admin-navbar/admin-navbar.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { AdminCardComponent } from './admin/admin-layout/admin-card/admin-card.component';
import { FilterableTableComponent } from './components/filterable-table/filterable-table.component';
import { FilterableDropdownComponent } from './components/filterable-dropdown/filterable-dropdown.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
    SurveyFillingComponent,
    AdminNavbarComponent,
    AdminDashboardComponent,
    AdminGroupsComponent,
    AdminSurveysComponent,
    AdminUsersComponent,
    AdminLayoutComponent,
    AdminCardComponent,
    FilterableTableComponent,
    FilterableDropdownComponent,
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
    // NgbModule
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
