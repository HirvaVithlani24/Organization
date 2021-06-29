import { Injectable } from '@angular/core';
import { HttpEvent, HttpResponse, HttpHandler, HttpInterceptor, HttpErrorResponse, HttpRequest, HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
import { OrganizationVM } from 'src/app/organization/organizationVM.model'
@Injectable({
  providedIn: 'root'
})

export class OrganizationService {
    private baseUrl = 'http://localhost:3000';
    public PARAMS = new HttpParams({
        fromObject: {
          action: 'opensearch',
          format: 'json',
          origin: '*'
        }
      });

    constructor(public http: HttpClient){
    }
    
    
    getAll(): Observable<OrganizationVM[]> {
      return this.http.get<any>(this.baseUrl + '/organization');
    }
   
    get(id: string): Observable<OrganizationVM> {
      return this.http.get<any>(this.baseUrl + '/organization/' + id);
    }
   
    create(objOrganization: OrganizationVM) {
      return this.http.post<any>(this.baseUrl + '/organization',objOrganization).subscribe(r=>{});
    }

// public getDetails(){
//     return this.details;
//   }

  public getOrganizationDash(queryString: any = null): Observable<object> {
    //let url = 'https://urldefense.com/v3/__https://www.ag-grid.com/example-assets/olympic-winners.json__;!!FVxzmgxCivIWb2dl0Q!43JxXTj1sMgYEqdsXqGxFj9B_iF_d5QzXp9VILg8cs_mX6sf3D8tDhC2sE07gZM-IdjHm520QKAQC6A$ ';
    let url = 'http://localhost:3000/organization';
    if (queryString) {
      url += `?${queryString}`;
    }
    console.log(url);
    return this.http.get(url);
  }
   
    update(id: string, objOrganization: OrganizationVM): Observable<OrganizationVM> {
      return this.http.put<any>(this.baseUrl + '/organization/' + id, objOrganization)
    }
   
    delete(id: string) {
      return this.http.delete<any>(this.baseUrl + '/organization/' + id);
    }

    getStatus():any {
      return this.http.get<any>(this.baseUrl + '/status');
    }
  }