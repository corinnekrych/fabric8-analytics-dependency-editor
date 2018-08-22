import {
  Component,
  OnInit,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ViewChild,
  SimpleChanges
} from '@angular/core';
import {
  FormsModule
} from '@angular/forms';
import {
  AccordionModule
} from 'ngx-bootstrap';
import {
  StackLicenseAnalysisModel,
  LicenseStackAnalysisModel,
  AlertBox,
  LicenseUIModel,
  ErrorUIModel
} from '../model/data.model';
import {
  AlertBoxComponent
} from '../alert-box/alert-box.component';
import { DependencyEditorService } from '../shared/dependency-editor.service';

@Component({
  selector: 'app-license',
  styleUrls: ['./license.component.less'],
  templateUrl: './license.component.html'
})

export class LicenseComponent implements OnInit, OnChanges {
  @ViewChild(AlertBoxComponent) alertBoxComponent: AlertBoxComponent;

  public isLoading: boolean = true;
  public title = 'License';
  public icon = 'pficon pficon-on-running';
  public stackLicense: string;
  public stackStatus: string;
  public hasIssue: boolean | string = false;
  public responseReady = false;
  public toHave = false;
  public licenseAll: Array < string > = [];
  public licenseIssue = true;
  public licenseDt: Array < any > = [];
  public licenseCount: any = {};
  public liData: Array<any> = [];
  public charts: any = null;

  public alertConfig: AlertBox = null;
  public config: any = {};

  private licenseData: StackLicenseAnalysisModel;
  private lisData: LicenseStackAnalysisModel;
  private allLicenses: Array < any > = [];
  private tooltipText: string = 'Shows the distinct licenses and the stack license';


  constructor(private service: DependencyEditorService) {
    this.isLoading = true;
    this.subscribeToLicenseInformation();
  }

  subscribeToLicenseInformation(): void {
    this.service.licenseSubscription.subscribe((response: LicenseUIModel | ErrorUIModel) => {
      if (response instanceof LicenseUIModel) {
        this.licenseData = response.licenseData;
        this.lisData = response.lisData;
        this.allLicenses = response.allLicenses;
        this.handleChanges();
      } else if (response instanceof ErrorUIModel) {
        this.config = {
          header: {
            tooltip: this.tooltipText,
            icon: this.icon,
            name: this.title
          },
          body: {
            defaultText: response.message
          }
        };
        this.alertConfig = <AlertBox> this.config;
      }
      this.isLoading = false;
    });
    this.service.needsLicenseChange.subscribe((response: boolean) => {
      if (response) {
        this.getLicenseData();
      }
    });
  }

  handleChanges() {
    this.stackStatus = '';
    if (this.licenseData && this.licenseData.status) {
      if (this.licenseData.status.toLowerCase() === 'successful') {
        this.hasIssue = false;
        this.stackLicense = this.licenseData.f8a_stack_licenses[0];
        this.stackStatus = this.licenseData.status;
      } else if (this.licenseData.status.toLowerCase() === 'failure') {
        this.hasIssue = 'na';
        this.stackLicense = 'Unknown';
        this.stackStatus = this.licenseData.status;
      } else if (this.licenseData.status.toLowerCase() === 'conflict' || this.licenseData.status.toLowerCase() === 'unknown') {
        this.hasIssue = true;
        this.stackLicense = 'None';
        this.stackStatus = this.licenseData.status;
      }
    } else if (this.lisData) {
      if (this.lisData.status.toLowerCase() === 'successful') {
        this.hasIssue = false;
        this.stackLicense = this.lisData.stack_license;
        this.stackStatus = this.lisData.status;
      } else if (this.lisData.status.toLowerCase() === 'failure') {
        this.hasIssue = 'na';
        this.stackLicense = 'Unknown';
        this.stackStatus = this.lisData.status;
      } else if (this.lisData.status.toLowerCase() === 'conflict' || this.lisData.status.toLowerCase() === 'unknown') {
        this.hasIssue = true;
        this.stackLicense = 'None';
        this.stackStatus = this.lisData.status;
      }
    } else {
      this.stackLicense = null;
      this.stackStatus = null;
    }
    this.licenseAll = [];
    if (this.stackStatus === 'Successful' && this.allLicenses) {
      for (let x = 0 ; x < this.allLicenses.length ; x++) {
          this.allLicenses.forEach((i) => {
            this.licenseAll.push(i);
          });
      }
    }
    this.licenseChange();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.handleChanges();
  }

  ngOnInit() {
    this.handleChanges();
  }

  public getShow(event: any) {
    this.toHave = event.toShow;
  }

  public licenseChange() {
    if (this.stackStatus === 'Successful') {
      if (this.licenseAll) {
        this.licenseDt = [];
        this.licenseCount = {};
        this.licenseAll.forEach(d => {
          this.licenseDt = this.licenseDt.concat(
                d
              );
            });
          this.licenseDt.forEach((item: string) => {
            this.licenseCount[item] = (this.licenseCount[item] || 0) + 1;
          });
          this.liData = [];
          Object.keys(this.licenseCount).forEach((k: any) => {
            this.liData.push([
              k,
              Math.round(this.licenseCount[k] * 100 / this.licenseDt.length)
            ]);
          });
        }
    }
       this.displayLicenses(this.liData);
  }

  public displayLicenses(liData: any): void {
    if (this.stackStatus === 'Successful') {
      this.charts = {};
      this.charts['data'] = {
      columns: liData,
      type: 'donut'
    };
    this.charts['options'] = {
      donut: {
        title:  liData.length + ' Licenses',
        width: 10,
        label: {
           show: false
           }
    },
    size: {
      height: 200,
      width: 280
    }
   };
    this.charts['configs'] = {
      legend: {
        show: true,
        position: 'right'
      }
    };
   }

   // Forms configuration to make use of alert-box component

  this.config = {
    header: {
      icon: this.icon,
      tooltip: this.tooltipText,
      name: this.title,
      secondaryInfo: {
        mainText: this.stackLicense,
        subText: '(Stack Level)'
      }
    },
    body: {}
  };

  if (this.charts) {
    this.config['body']['graphic'] = this.charts;
  } else {
    this.config['body']['defaultText'] = 'Unable to render chart';
  }

  this.alertConfig = <AlertBox> this.config;
  this.isLoading = false;
  }

  private getLicenseData() {
    let payload: any = this.service.getPayload();
    this.isLoading = true;
    this.service.getDependencyData('LICENSE', payload)
      .subscribe((response: LicenseStackAnalysisModel) => {
        this.service.licenseSubscription.next(new LicenseUIModel(null, response, response.distinct_licenses));
        this.isLoading = false;
      }, (error: any) => {
        this.service.licenseSubscription.next(new ErrorUIModel(error.status, error.message));
        this.isLoading = false;
    });
  }

}
