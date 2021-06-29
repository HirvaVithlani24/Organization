import { Component, Injectable, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import {merge, observable, Observable, of, OperatorFunction, Subject} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, filter, map, switchMap, tap} from 'rxjs/operators';
import { EmailValidator, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {HttpClient, HttpParams} from '@angular/common/http';
import { OrganizationVM } from '../organizationVM.model';
import { OrganizationService } from '../organization.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';


@Injectable()

@Component({
  selector: 'app-create-organization',
  templateUrl: './create-organization.component.html',
  styleUrls: ['./create-organization.component.scss'],
  providers: [OrganizationService,DatePipe],
})
export class CreateOrganizationComponent implements OnInit {

  OrgDetailForm = this.fb.group({
    OrgName: ['', Validators.required],
    id: [],
    AliasName: ['', Validators.required],
    Status: ['', Validators.required],
    Time: [new Date()],
    Email: ['',Validators.email],
    Date: [this.datepipe.transform(new Date(), 'MM-dd-yyyy')],
    Trial: [],
  });

  Organization = this.fb.group({
    Org: ['']
  });

  organizationVM : OrganizationVM[] = [];
  newOrganization : boolean = false;
  orgModel :any = [];
  statusModel :any = [];
  item :any = '';
  formSubmitAttempt: boolean = false;
  model: any;
  
  @Input() fromParent : any;

  constructor(public activeModal: NgbActiveModal, public fb: FormBuilder, private http: HttpClient, private _service: OrganizationService, public datepipe: DatePipe) { }

  ngOnInit(): void {
    this._service.getAll().subscribe((data:any)=>{
        this.organizationVM = data;
        console.log(this.organizationVM);
        this.orgModel = data.map((x: { OrgName: any; }) => x.OrgName)
        // this.statusModel = data.map((x: { Status: any; }) => x.Status)
    console.log(this.orgModel)})

    this._service.getStatus().subscribe((data:any)=>{
      this.statusModel = data.map((x: { Type: any; }) => x.Type)
  console.log(this.statusModel)})
    
  }

  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.orgModel.filter((v: string) => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 20))
    )

  onKeypressEvent(event : any) {
    console.log(this.Organization.get('Org')?.value);
    console.log(this.orgModel);
    for (var i = 0, len = this.orgModel.length; i < len; i++){
        if (this.orgModel[i] === this.Organization.get('Org')?.value){
            this.newOrganization = false;
            break;
        }
        else{
          this.newOrganization = true;

        }
    }

    
  if (this.newOrganization)
  {
  this.OrgDetailForm.reset();
}
else
{
  let result = this.organizationVM.filter(item => item.OrgName === this.Organization.value.Org);
  console.log(result[0]);
  this.OrgDetailForm.patchValue(result[0]);
  console.log(this.OrgDetailForm.value);
}
}

   
  //   public search1 = '';
  // selectedStatic(result:any) {
  //   this.search1 = result;
  //   this.Organization.value.Org = this.search1;
  //   this.newOrganization = false;

  // }

  closeModal(sendData : any) {
    this.activeModal.close(sendData);
    this.OrgDetailForm.reset();
        this.Organization.reset();
        this.newOrganization = false;
        this.formSubmitAttempt = false;
  }


  changeStatus(event : any){
    this.OrgDetailForm.value.Status = event.target.value;
  }

  submitOrganization(event : any):any{
    if(this.OrgDetailForm.valid){
    if(this.newOrganization===false)
    {
      console.log(this.OrgDetailForm);
        const obj : OrganizationVM = this.OrgDetailForm.value;
    Swal.fire({
      title: 'This Record already exists',
      text: 'Are you sure you want to create a new record?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Create new',
      cancelButtonText: 'No, Update the existing one',
    }).then((result) => {

      if (result.isConfirmed) {

        
        this._service.create(obj);
        this.OrgDetailForm.reset();
        this.Organization.reset();
        this.newOrganization = false;
        this.formSubmitAttempt = false;

      } else if (result.isDismissed) {

        console.log(this.OrgDetailForm);
        const obj : OrganizationVM = this.OrgDetailForm.value;
        let result = this.organizationVM.filter(item => item.OrgName === this.Organization.value.Org);
        this._service.update(result[0].id,obj).subscribe(r=>{});
        //Swal.fire('Done!', 'Your record is updated', 'success')
        this.OrgDetailForm.reset();
        this.Organization.reset();
        this.newOrganization = false;
        this.formSubmitAttempt = false;

      } 
    })

  }
  else if(this.newOrganization===true)
  {
    Swal.fire({
      title: 'Please confirm',
      text: 'Are you sure you want to create a new record?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Create',
      cancelButtonText: 'Cancel',
    }).then((result) => {

      if (result.isConfirmed) {

        console.log(this.OrgDetailForm);
        const obj : OrganizationVM = this.OrgDetailForm.value;
        this._service.create(obj);
        this.OrgDetailForm.reset();
        this.Organization.reset();
        this.newOrganization = false;
        this.formSubmitAttempt = false;

      } else if (result.isDismissed) {

          console.log('submit event cancelled!');

      } 
    })
  }
    
  }
  else
  {
    this.formSubmitAttempt = true;
    Swal.fire('Sorry', 'Your form is invalid, please enter valid correct details!', 'error');
  }
  }

}