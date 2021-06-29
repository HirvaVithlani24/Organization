import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { LoggingService } from './core/services/logger/logger.service';
import { WeatherForecast } from './WeatherForecastDemo/WeatherForecast.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CreateOrganizationComponent } from './organization/createOrg/create-organization.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Note Finance';
  lstWeatherForecast: WeatherForecast[] = new Array();

  constructor(private logger: LoggingService, private http: HttpClient) {
    this.logger.sendTraceLevelMessage('App Component - Trace', this, { error: 'none' });
    this.logger.sendDebugLevelMessage('App Component - Debug', this, { error: 'none' });
    this.logger.sendInfoLevelMessage('App Component - Info');
    this.logger.sendLogLevelMessage('App Component - Log', this, { error: 'New Log Error' });
    this.logger.sendWarnLevelMessage('App Component - Warn', { error: 'New Warning' });
    this.logger.sendErrorLevelMessage('App Component - Error', this, { error: 'New Error' });
    this.logger.sendFatalLevelMessage('App Component - Fatal', this, { error: 'New Fatal Error' });
  }

 

  throwError() {
    throw new Error('my new error');
  }

  throwHttpError() {
    this.http.get('https://localhost:44332/WeatherForecast')
      .toPromise()
      .then(res => this.lstWeatherForecast = res as WeatherForecast[]);

    console.log(this.lstWeatherForecast);
  }

 
}
