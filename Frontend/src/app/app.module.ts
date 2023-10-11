import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ManageUsersComponent } from './manage-users-component/manage-users-component.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { SurveyService } from './services/survey.service';
import { SurveyComponent } from './survey/survey.component'; // adjust path accordingly

import { ButtonComponent } from './components/button/button.component';
import { NgxBootstrapIconsModule, allIcons } from 'ngx-bootstrap-icons';
import { AlertModule } from 'ngx-bootstrap/alert';
import { SurveyResultsChartComponent } from './survey-results-chart/survey-results-chart.component';
// import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';
// import { NgXClickOutsideModule } from 'ngx-click-outside';
import { ClickOutsideDirective } from './directives/ClickOutsideDirective';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    ManageUsersComponent,
    SurveyComponent,
    ButtonComponent,
    SurveyResultsChartComponent,
    ClickOutsideDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxBootstrapIconsModule.pick(allIcons),
    AlertModule,
    NgApexchartsModule,
    // NgXClickOutsideModule
    // NgbModule
  ],
  providers: [SurveyService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
