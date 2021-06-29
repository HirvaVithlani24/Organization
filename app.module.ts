import { NgModule, APP_INITIALIZER, ErrorHandler } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { AgGridModule } from 'ag-grid-angular';
import { AppConfigService } from './core/services/appConfig/appConfig.service';
import { GlobalErrorHandler } from './core/services/errorHandler/globalErrorHandler';
import { ServerErrorInterceptor } from './core/services/httpInterceptor/serverError.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { CreateOrganizationComponent } from './organization/createOrg/create-organization.component';
import { NgxTypeaheadModule } from 'ngx-typeahead';
import { FooterComponent } from './footer/footer.component';
import { DashboardComponent } from './organization/dashboard/dashboard.component';
import { MatToolbarModule } from  '@angular/material/toolbar';
import { MatIconModule } from  '@angular/material/icon';
import { MatSidenavModule } from  '@angular/material/sidenav';
import { MatListModule } from  '@angular/material/list';
import { MatButtonModule } from  '@angular/material/button';
import { MatChipsModule} from '@angular/material/chips';


export function InitializeApp(appConfig: AppConfigService) {
  return () => appConfig.load();
}

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    CreateOrganizationComponent,
    FooterComponent,
    DashboardComponent
  ],

  entryComponents: [
    CreateOrganizationComponent,
],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    NgxTypeaheadModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    LoggerModule.forRoot({
      level: NgxLoggerLevel.TRACE,
    }),
    AgGridModule.withComponents([]),
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  providers: [
    AppConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: InitializeApp,
      deps: [AppConfigService],
      multi: true
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
