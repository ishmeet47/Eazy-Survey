import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ManageUsersComponent } from './manage-users-component/manage-users-component.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { SurveyService } from './services/survey.service';
import { SurveyComponent } from './survey/survey.component'; // adjust path accordingly


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    ManageUsersComponent,
    SurveyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [SurveyService, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
