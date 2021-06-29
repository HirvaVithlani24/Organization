import { Component, OnInit } from '@angular/core';
import { OrganizationService } from '../organization.service';
import {AgGridAngular,AgGridModule} from 'ag-grid-angular';
import { HttpClient, JsonpClientBackend } from '@angular/common/http';
import {Observable} from 'rxjs'
import { GridOptions, GridApi, ColumnApi } from 'ag-grid';
import {ActivatedRoute,Router} from '@angular/router';
//import 'ag-grid-enterprise';
import { CreateOrganizationComponent } from '../createOrg/create-organization.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
//import { stringify } from 'querystring';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
//   columnDefs = [
//     { field: 'FacilityId', sortable: true, filter: true, pinned: 'left', sortingOrder:['desc','asc'],unSortIcon: true, cellRenderer: this.createHyperLink.bind(this),},
//     { field: 'FacilityName', sortable: true, filter: true, pinned: 'left', sortingOrder:['desc','asc'],unSortIcon: true, },
//     { field: 'FacilityStatus', sortable: true, filter: true, pinned: 'left', sortingOrder:['desc','asc'] ,unSortIcon: true, },
//     { field: 'FacilityAlertIndicator', sortable: true, filter: true , sortingOrder:['desc','asc'] ,unSortIcon: true, },
//     { field: 'Commitment', sortable: true, filter: true , sortingOrder:['desc','asc'] ,unSortIcon: true, },
//     { field: 'BorrowingLimit', sortable: true, filter: true, sortingOrder:['desc','asc'] ,unSortIcon: true, },
//     { field: 'Availability', sortable: true, filter: true , sortingOrder:['desc','asc'],unSortIcon: true,  },
//     { field: 'RMName', sortable: true, filter: true , sortingOrder:['desc','asc'] ,unSortIcon: true, },
//     { field: 'PortfolioManager', sortable: true, filter: true , sortingOrder:['desc','asc'] ,unSortIcon: true,},
//     { field: 'AliasName', sortable: true, filter: true , sortingOrder:['desc','asc'] ,unSortIcon: true, },
//     { field: 'RelationshipName', sortable: true, filter: true, sortingOrder:['desc','asc']  ,unSortIcon: true, },
//     { field: 'RelationshipId', sortable: true, filter: true, sortingOrder:['desc','asc'] ,unSortIcon: true, },
//     { field: 'AnalystName', sortable: true, filter: true, sortingOrder:['desc','asc']  ,unSortIcon: true, },
//     { field: 'CollateralSpecialist', sortable: true, filter: true , sortingOrder:['desc','asc'] ,unSortIcon: true, },
//     { field: 'MaturityDate', sortable: true, filter: true , sortingOrder:['desc','asc'] ,unSortIcon: true,},
//     { field: 'NoteIssuanceDate', sortable: true, filter: true , sortingOrder:['desc','asc'] ,unSortIcon: true, },
//     { field: 'PaymentStatus', sortable: true, filter: true, sortingOrder:['desc','asc']  ,unSortIcon: true, },
//     { field: 'LastUpdatedDate', sortable: true, filter: true , sortingOrder:['desc','asc'],unSortIcon: true, },
//     { field:'',cellRenderer: this.createEditBtn.bind(this)}
// ];
  columnDefs = [
    { field: 'id', maxWidth:150, hide:false, headerName:'Org Id', filter: true, pinned: 'left',  cellRenderer: this.createHyperLink.bind(this),},
    { field: 'OrgName',maxWidth:150, hide:false, headerName:'Org Name', filter: true, pinned: 'left',  },
    { field: 'AliasName', maxWidth:150, hide:false, headerName:'Alias Name', filter: 'agTextColumnFilter', pinned: 'left',  },
    { field: 'Status', maxWidth:150, hide:false, headerName:'Status', filter: true ,  },
    { field: 'Email', maxWidth:200, hide:false, headerName:'Email Id', filter: true ,  },
    { field: 'Trial',maxWidth:150, hide:false, headerName:'Trial',filter: 'agNumberColumnFilter',  },
    { field: 'Date',maxWidth:150, hide:false, headerName:'Joined Date',filter: true ,   },
    { field: 'Time', maxWidth:150, hide:false, headerName:'Joining Time',filter: true ,  },
    { field: '', maxWidth:80,sortable:false, cellRenderer: this.createEditBtn.bind(this)}
  ];          

  gridApi: GridApi = new GridApi;
  gridColumnApi : ColumnApi = new ColumnApi;
  gridOptions: GridOptions | any;
  rowData: any;
  searchValue:any;
  chips: Array<string>=[];
  removable = true;
  constructor( public orgService:OrganizationService, private http: HttpClient, private router:ActivatedRoute,private _router: Router,public modalService: NgbModal) {   }


  ngOnInit(): void {
    // SETTING THE GRID OPTION
    this.setGridOptions();
  }
  setGridOptions(): void {
    this.gridOptions = {
      rowData: this.rowData,
      columnDefs: this.columnDefs,
      cacheBlockSize: 3,
      rowModelType: 'infinite',
      rowSelection:'multiple',
      //suppressHorizontalScroll: true,
      paginationPageSize: 15,
      cacheOverflowSize: 2,
      defaultColDef:{
        sortable: true,
        sortingOrder:['desc','asc'] ,
        unSortIcon: true,
        resizable:true,
        filterParams: {
          suppressAndOrCondition: true,
        }
      },
      //import ag-grid-enterprise to make it work
      sideBar : {
        toolPanels: [
          {
            id: 'columns',
            labelDefault: 'Columns',
            labelKey: 'columns',
            iconKey: 'columns',
            toolPanel: 'agColumnsToolPanel',
            toolPanelParams: {
              suppressRowGroups: true,
              suppressValues: true,
              suppressPivots: true,
              suppressPivotMode: true,
              suppressColumnFilter: true,
              suppressColumnSelectAll: true,
              suppressColumnExpandAll: true,
            },
          },
        ],
        defaultToolPanel: 'columns',
      },
    };
  }

  quickSearch(event:any) {
    console.log(this.searchValue);
    this.setGridData();
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi= params.columnApi;
    //this.gridApi.sizeColumnsToFit();
    this.setGridData();
  }

  openModal() {
    //Here you define the name of your component
    const modalRef = this.modalService.open(CreateOrganizationComponent, { size: 'lg', scrollable: true,
      windowClass: 'myCustomModalClass',backdrop: 'static'});
    //This section is if you want to have any variable to initialize
    //compConst.componentInstance.weight = undefined;

  let data;
  modalRef.componentInstance.fromParent = data;
    modalRef.result.then((result : any) => {
    console.log(result);
    }, (reason : any) => {
    });
  }
  remove(chip: any): void {
    const index = this.chips.indexOf(chip);
    if (index >= 0) {
      this.chips.splice(index, 1);
    }
    //console.log(chip);
    console.log(JSON.stringify(chip).split(" ")[0].replace('"',""));
    this.gridApi.destroyFilter(JSON.stringify(chip).split(" ")[0].replace('"',""));
    
  }
  setGridData(){
    //console.log('testing'+this.chips);
    let dataSourceVar: any;
    dataSourceVar = {
      getRows: (rowParams: any) => {
        let queryString='';
        // get data based on search text if exists in search text box
        let searchParams='';
        if(this.searchValue!=null && this.searchValue!=undefined && this.searchValue!="")
        {
            searchParams+=`q=${this.searchValue}`;
        }
        queryString=`${searchParams}`;

        // look for filter conditions to create querystring parameters
        let filterParams='';
        if((Object.entries(rowParams.filterModel).length)!=0)
        {
          
          if(queryString!=null && queryString!=undefined && queryString!="")
          {
            filterParams+='&';
          }
          //filterParams+='&$filter=';
          this.chips.splice(0,this.chips.length);
          Object.entries(rowParams.filterModel).forEach(
            ([key, value]) => {
              let chipcontent=''; 
              filterParams+= key+'=';
              chipcontent+=key +' ';
              //console.log(key, value);
              let obj:any = value;
              Object.keys(obj).forEach(key => {
                if(key=='filter'){
                  filterParams+= obj[key]+'&';
                  chipcontent+=obj[key];
                };
                if(key=='type'){
                  chipcontent+=obj[key] +' ';
                }
                //console.log(`key: ${key}, value: ${obj[key]}`)
              })
              this.chips.push(chipcontent);
            }
          );
        }
        
        queryString+=`${filterParams}`;
        //console.log(filterParams);

        // look for sorted elements to add to querystring parameters
        let sortParams = '';
        rowParams.sortModel.forEach((model: any) => {
          if(queryString!=null && queryString!=undefined && queryString!="")
          {
            sortParams += `&_sort=${model["colId"]}&_order=${model.sort}`;
          }
          else{
            sortParams += `_sort=${model["colId"]}&_order=${model.sort}`;
          }
        });
        queryString+=`${sortParams}`;

        // look for start and end row from CacheBlock element to get number of records at a time
        let pagingParams='';
        if(queryString!=null && queryString!=undefined && queryString!="")
        {
          pagingParams = `&start=${rowParams.startRow}&end=${rowParams.endRow}`;
        }
        else
        {
          pagingParams = `start=${rowParams.startRow}&end=${rowParams.endRow}`;
        }
        queryString+=`${pagingParams}`;

        //const countParam = `$count=true`;
        
        
        //queryString = `${searchParams}${pagingParams}${sortParams}`;
        console.log("queryString"+queryString);
        
        this.orgService.getOrganizationDash(queryString).subscribe((data: any) => {
          // data['@odata.count'] : Show the Total Number of records in our table
          // data.value : give the records
          //check total records to set lastRow
          var lastRow=-1;
          var rowsThisPage= data.slice(rowParams.startRow, rowParams.endRow);
          if(data.length<= rowParams.endRow)
          {
            lastRow = data.length
          }
          //console.log("check"+JSON.stringify(rowsThisPage));
          //this.rowData = data;
          //rowParams.successCallback(data, data['@odata.count']);
          rowParams.successCallback(rowsThisPage, lastRow);
        });
      }
    };
    this.gridApi.setDatasource(dataSourceVar);
  }

  createOrganization(){
    this._router.navigate(['/createComponent']);
  }


  createHyperLink(params: any) {
    if (!params.data) { return; }
    const spanElement = document.createElement('span');
    spanElement.innerHTML = `<a href="${this.viewUrl}/${params.value}" ><u> ${params.value}</u> </a> `;
    spanElement.addEventListener('click', ($event) => {
      //$event.preventDefault();
      // The below code is used to navigate from one page to another page in angular. you can change it          // according to your requirement.
      this._router.navigate([this.viewUrl]);
    });
    return spanElement;
  }

  createEditBtn(params: any) {
    if (!params.data) { return; }
    const spanElement = document.createElement('span');
    spanElement.innerHTML = `<a href="${this.editUrl}/${params.rowIndex+1}" ><img style='height: 20px; opacity: 0.7' src='assets/images/pencil_icon.svg'> </a> `;
    spanElement.addEventListener('click', ($event) => {
      //$event.preventDefault();
      // The below code is used to navigate from one page to another page in angular. you can change it          // according to your requirement.
      this._router.navigate([this.editUrl]);
    });
    return spanElement;
  }
  get editUrl(): string {
    return 'editOrganization';
  }
  get viewUrl(): string {
    return 'viewOrganization';
  }
  isShowDiv=true;
  toggleDisplayDiv()
  {
    this.isShowDiv=!this.isShowDiv;
  }
  setChange(columnName:any){
    let modifiedCols = this.columnDefs;
    modifiedCols.forEach(function(coldef){

      if(coldef.field===columnName)
      {
        if(coldef.hide===false)
          coldef.hide = true;
        else
          coldef.hide = false;
      }
    });
    console.log(this.columnDefs);
    this.gridOptions.api.setColumnDefs(modifiedCols);
  }

}
