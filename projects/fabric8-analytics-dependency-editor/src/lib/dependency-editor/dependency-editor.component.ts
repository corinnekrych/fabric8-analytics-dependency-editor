import {
  Component,
  OnInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  Input,
  Output,
  EventEmitter,
  ViewChild
} from '@angular/core';
import * as _ from 'lodash';

import {
  DependencyEditorService
} from '../shared/dependency-editor.service';
import {
  ErrorMessageHandler
} from '../shared/error-message-handler';
import {
  StackReportModel,
  DependencySnapshotItem,
  ComponentInformationModel,
  ResultInformationModel,
  StackLicenseAnalysisModel,
  CveResponseModel,
  DependencySearchItem,
  EventDataModel,
  LicenseStackAnalysisModel,
  BoosterInfo,
  ErrorUIModel,
  LicenseUIModel,
  RecommendationsModel
} from '../model/data.model';
import {
  DependencySnapshot
} from '../utils/dependency-snapshot';

import { DepEditorUtils } from '../shared/utils';
import { Broadcaster } from 'ngx-base';
import { timer } from 'rxjs';
import { takeWhile } from 'rxjs/operators';


@Component({
  selector: 'app-dependency-editor',
  styleUrls: ['./dependency-editor.component.less'],
  templateUrl: './dependency-editor.component.html'
})
export class DependencyEditorComponent implements OnInit, OnChanges, OnDestroy {
  @Input() githubUrl = '';
  @Input() boosterInfo: BoosterInfo = null;
  @Input() githubRef = '';
  @Input() metadataInfo: any = null;
  @Input() blankResponse: any = null;
  @Input() broadcaster: Broadcaster;

  @Output() depSnapshot: EventEmitter<any> = new EventEmitter<any>();
  @Output() emitMetadata: EventEmitter<any> = new EventEmitter<any>();
  @Output() navId: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('dependencyPreview') modalDependencyPreview: any;

  public dependencies: Array<DependencySnapshotItem>;
  public companions: Array<ComponentInformationModel>;
  public alternate: Array<ComponentInformationModel>;
  public licenseData: StackLicenseAnalysisModel;
  public lisData: LicenseStackAnalysisModel;
  public allLicenses: Array<any> = [];
  public cveData: CveResponseModel;
  public dependenciesAdded: Array<ComponentInformationModel> = [];
  public dependencyAdded: Array<DependencySnapshotItem> = [];
  public packageLength = 0;
  public addPackageLength = 0;
  public listView = 'View Dependency List';
  public metadata = {};
  public error: any = null;
  public errorStack: any;
  public errorPostStack: any;
  public errorLicense: any;
  public errorSecurity: any;
  public errorInsight: any;

  private stackUrl: string;
  private stackUrlDev: string;
  private getDepInsightsUrl: string;
  private getCveUrl: string;
  private getLicenseUrl: string;
  private isDepSelectedFromSearch = false;
  private depToAdd: DependencySearchItem;

  constructor(
    private service: DependencyEditorService,
    private errorMessageHandler: ErrorMessageHandler
  ) { }

  ngOnInit() {
    this.service.dependencySelected
      .subscribe((depSelected: DependencySearchItem) => {
        this.isDepSelectedFromSearch = true;
        this.depToAdd = depSelected;
        const obj: any = {
          depFull: null,
          depSnapshot: {
            package: depSelected.name,
            version: depSelected.version
          },
          action: 'add'
        };
        this.callDepServices(obj);
      });
    this.service.dependencyRemoved
      .subscribe((data: EventDataModel) => {
        this.callDepServices(data);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['githubUrl'] && changes['githubUrl']['currentValue'] && changes['githubRef'] && changes['githubRef']['currentValue']) {
      this.postStackAnalyses(this.githubUrl, this.githubRef);
    }
    if (changes['blankResponse'] && changes['blankResponse']['currentValue']) {
      this.blankMissionFlow();
    }
  }

  blankMissionFlow(): void {
    this.getDependencyInsights(this.blankResponse, true);
    // this.getCveData(this.blankResponse);
    this.getLicenseData(this.blankResponse);
  }

  ngOnDestroy() {
    DepEditorUtils.isLoaded = false;
    this.service.cacheHiddenDependency = [];
  }

  public doContinue() {
  }

  public callDepServices(eventData: EventDataModel) {
    this.reset();
    this.service.updateDependencyAddedSnapshot(eventData);
    if (this.isDepSelectedFromSearch) {
      DependencySnapshot.DEP_FULL_ADDED.push(<ComponentInformationModel>this.depToAdd);
      this.isDepSelectedFromSearch = false;
    }
    this.dependenciesAdded = _.uniq(DependencySnapshot.DEP_FULL_ADDED);
    this.depSnapshot.emit(DependencySnapshot.DEP_SNAPSHOT_ADDED);
    const payload = this.service.getPayload();
    this.getDependencyInsights(payload, false);
    this.emitLicenseChangeNeeded();
    this.emitSecurityChangeNeeded();
  }

  public checkIfAlternatePresent(alternates: ComponentInformationModel[]) {
    alternates.forEach((alternate: ComponentInformationModel) => {
      DependencySnapshot.DEP_FULL_ADDED.forEach((depAdded) => {
        if (alternate.name === depAdded.name) {
          depAdded.alternate = alternate.alternate;
        }
      });
    });
  }

  public checkIfSecurityPresent(analyzedDependencies: ComponentInformationModel[]) {
    DependencySnapshot.DEP_FULL_ADDED.forEach((depFullAdded: ComponentInformationModel) => {
      if (!depFullAdded.security) {
        const objWithSecurity = _.find(analyzedDependencies, (dep) => {
          return dep.name === depFullAdded.name;
        });
      }
    });
  }

  public getMetadata(event: any): void {
    this.metadata = event;
    this.emitMetadata.emit(this.metadata);
  }

  public showDependencyModal(event: Event) {
    this.modalDependencyPreview.open();
    this.packageLength = DependencySnapshot.DEP_SNAPSHOT.length;
    this.addPackageLength = DependencySnapshot.DEP_SNAPSHOT_ADDED.length;
  }

  public closemodal() {
    this.modalDependencyPreview.close();
  }

  public navToStep(id: string) {
    this.navId.emit(id);
  }

  private reset() {
    this.companions = null;
    this.alternate = null;
    this.dependenciesAdded = null;
    this.cveData = null;
    this.licenseData = null;
  }

  private setDependencies(result: any) {
    if (result) {
      this.dependencies = _.uniq(result);
    }
  }

  private setCompanions(result: RecommendationsModel) {
    if (result && result.companion) {
      this.companions = _.uniq(result.companion);
    } else {
      this.companions = null;
    }
  }

  private setLicenseData(result: ResultInformationModel) {
    this.licenseData = result.user_stack_info.license_analysis;
    this.allLicenses = result.user_stack_info.distinct_licenses;
    this.service.licenseSubscription.next(new LicenseUIModel(this.licenseData, null, this.allLicenses));
  }

  private setAlternate(result: RecommendationsModel) {
    if (result && result.alternate) {
      this.alternate = _.uniq(result.alternate);
    }
  }

  private postStackAnalyses(githubUrl: string, githubRef: string) {
    this.service.postStackAnalyses(githubUrl, githubRef)
      .subscribe((data: any) => {
        let subs: any = null;
        let rec: any = null;
        const interval = 5000;
        let alive = true;
        let counter = 0;
        const observable: any = this.service
          .getStackAnalyses(data['id']);
        timer(0, interval).pipe(
          takeWhile(() => alive)
          ).subscribe(() => {
            if (rec) {
              subs.unsubscribe();
              alive = false;
            }
            subs = observable.subscribe((response: any) => {
              const result: any = response.result && response.result[0] || null;
              if (result !== null) {
                rec = result.recommendation;
                DependencySnapshot.ECOSYSTEM = result.user_stack_info.ecosystem;
                DependencySnapshot.DEP_SNAPSHOT = result.user_stack_info.dependencies;
                DependencySnapshot.REQUEST_ID = response.request_id;
                if (rec) {
                  alive = false;
                  this.setCompanions(rec);
                  this.setAlternate(rec);
                }
                if (result && result.user_stack_info && result.user_stack_info.dependencies) {
                  this.setDependencies(result.user_stack_info.dependencies);
                }
                this.setLicenseData(result);
                this.emitSecurityChangeNeeded();
              }
            }, (error: any) => {
              // Handle server errors here
              alive = false;
              this.errorStack = error && error.message;
              this.emitErrors(error);
            });
            if (counter++ > 4) {
              alive = false;
            }
          });
      }, (error: any) => {
        // Handle server errors here
        this.errorPostStack = error && error.message;
        this.emitErrors(error);
      });
  }

  private emitErrors(error: ErrorUIModel): void {
    this.error = error;
    this.service.licenseSubscription.next(error);
    this.service.securitySubscription.next(error);
  }

  private getLicenseData(payload: any) {
    this.service.getDependencyData('LICENSE', payload)
      .subscribe((response: LicenseStackAnalysisModel) => {
        this.service.licenseSubscription.next(new LicenseUIModel(null, response, response.distinct_licenses));
      }, (error: any) => {
        this.service.licenseSubscription.next(new ErrorUIModel(error.status, error.message));
      });
  }

  private getDependencyInsights(payload: any , isBlankMissionCall: boolean) {
    let subs: any = null;
    let rec: any = null;
    const interval = 5000;
    let alive = true;
    let counter = 0;

    if (isBlankMissionCall) {
      this.setDependencies(payload._resolved);
      DependencySnapshot.DEP_SNAPSHOT = payload._resolved;
    }
    const observable: any = this.service
      .getDependencyData('DEPEDITORANALYSIS', payload);
    timer(0, interval).pipe(takeWhile(() => alive))
      .subscribe(() => {
        if (rec) {
          subs.unsubscribe();
          alive = false;
        }
        subs = observable.subscribe((response: StackReportModel) => {
          rec = response && response.result && response.result[0] || null;
          if (rec) {
            if (rec.recommendation) {
              const recommendation: RecommendationsModel = response.result[0].recommendation;
              alive = false;
              this.setCompanions(recommendation);
              this.setAlternate(recommendation);
              this.checkIfAlternatePresent(recommendation.alternate);
            }
            const resultInformationModel: ResultInformationModel = response.result[0];
            this.checkIfSecurityPresent(resultInformationModel.user_stack_info.analyzed_dependencies);
            DependencySnapshot.REQUEST_ID = response.request_id;
            this.handleInitialLoads(resultInformationModel);
          }
        }, (error: any) => {
          // Handle server errors here
          alive = false;
          this.errorInsight = error && error.message;
        });
        if (counter++ > 4) {
          alive = false;
        }
      });
  }

  private handleInitialLoads(resultInformationModel: ResultInformationModel): void {
    DependencySnapshot.ECOSYSTEM = resultInformationModel.user_stack_info.ecosystem;
    this.setLicenseData(resultInformationModel);
    this.emitSecurityChangeNeeded();
  }

  private emitLicenseChangeNeeded(): void {
    this.service.needsLicenseChange.next(true);
  }

  private emitSecurityChangeNeeded(): void {
    this.service.needsSecurityChange.next(true);
  }
}
