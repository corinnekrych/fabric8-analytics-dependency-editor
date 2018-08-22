import {
  Component,
  OnInit,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation
} from '@angular/core';
import {
  FormsModule
} from '@angular/forms';
import {
  AccordionModule
} from 'ngx-bootstrap';
import {
  AlertBox, BoosterInfo, CveResponseModel, CveDataDetailModel, ErrorUIModel
} from '../model/data.model';
import { DependencyEditorService } from '../shared/dependency-editor.service';

@Component({
  selector: 'app-security',
  styleUrls: ['./security.component.less'],
  templateUrl: './security.component.html'
})

export class SecurityComponent implements OnInit, OnChanges {
  @Input() boosterInfo: BoosterInfo;

  public isLoading = true;
  public cveData: CveResponseModel;
  public title = 'Security Alert';
  public icon = 'fa fa-shield';
  public noOfCves: number = null;
  public hasIssue = false;
  public toHave = false;
  public secureIssue = false;
  public itSecurity = true;
  public cveName: any = [];

  public alertConfig: AlertBox = null;
  private config: any = {};
  private tooltipText: string = 'Shows the security vulnerabilities in the stack';

  constructor(private service: DependencyEditorService) {
    this.isLoading = true;
    this.service.securitySubscription.subscribe((response: CveResponseModel | ErrorUIModel) => {
      if (response instanceof ErrorUIModel) {
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
      } else {
        let res: any = response;
        if (res['request_id'] && res['stack_highest_cvss']) {
          this.formAlert();
        }
      }

      this.isLoading = false;
    });
    this.service.needsSecurityChange.subscribe((response: boolean) => {
      if (response) {
        this.getCveData();
      }
    });
  }

  ngOnChanges() {
    this.formAlert();
  }

  ngOnInit() {
    this.formAlert();
  }

  public formAlert() {
    this.hasIssue = false;
    this.secureIssue = false;
    this.cveName = [];
    if (this.cveData) {
      this.noOfCves = 0;
      let count = -1;
      this.itSecurity = true;
      this.cveData.result.forEach(item => {
        count++;
        if (item.cve) {
          this.noOfCves++;
          this.hasIssue = true;
          this.secureIssue = true;

          if (item.cve !== null) {
            this.cveName.push({
              isAccordion: false,
              primaryText: item.cve.details && item.cve.details.length > 0 ? item.cve.details[0].cve_id : '',
              secondaryText: item.package
            });
          }
        }
      });
      if (this.noOfCves > 0) {
        this.itSecurity = false;
      }

      this.config = {
          header: {
            icon: this.icon,
            tooltip: this.tooltipText,
            name: this.title,
            countInfo: this.noOfCves,
            indicator: this.itSecurity === false ? 'ERROR' : ''
          },
          body: {
            normal: this.cveName,
            defaultText: this.noOfCves === 0 ? 'The analytics engine has not identified any security issues affecting your stack.' : ''
          }
      };
    } else {
      this.noOfCves = null;
      this.config = {
          header: {
            tooltip: this.tooltipText,
            icon: this.icon,
            name: this.title
          },
          body: {
            defaultText: 'The analytics engine has not identified any security issues affecting your stack.'
          }
      };
    }



  this.alertConfig = <AlertBox> this.config;
    this.isLoading = false;
  }

  public getShow(event: any) {
    this.toHave = event.toShow;
  }

  private getCveData() {
    let payload: any = this.service.getPayload();
    this.isLoading = true;
    this.service.getDependencyData('CVE', payload)
      .subscribe((response: CveResponseModel) => {
        this.service.securitySubscription.next((<CveResponseModel> response));
        this.isLoading = false;
      }, (error: any) => {
        this.cveData = null;
        this.service.securitySubscription.next(new ErrorUIModel(error.status, error.message));
        this.isLoading = false;
    });
  }
}
