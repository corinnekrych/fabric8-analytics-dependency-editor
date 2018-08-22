import {  Component,  OnInit,  OnChanges,  Input,  Output,  EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {
  DependencySnapshotItem,
  CveResponseModel,
  StackLicenseAnalysisModel,
  LicenseStackAnalysisModel,
  BoosterInfo
} from '../model/data.model';

@Component({
  selector: 'app-current-project',
  styleUrls: ['./current-project.component.less'],
  templateUrl: './current-project.component.html'
})

export class CurrentprojectComponent implements OnInit, OnChanges {
  @Input() dependencies: Array<DependencySnapshotItem>;
  @Input() boosterInfo: BoosterInfo = null;
  @Input() metadataInfo: any = null;
  @Input() licenseData: StackLicenseAnalysisModel;
  @Input() lisData: LicenseStackAnalysisModel;
  @Input() cveData: CveResponseModel;
  @Input() allLicenses: Array<any> = [];

  @Output() getMetadata: EventEmitter<any> = new EventEmitter<any>();

  public metadata: any = {};
  public start = 1;

  constructor() { }

  ngOnInit() {
}

  ngOnChanges() {
    if (this.metadataInfo && this.start > 0) {
      this.start = 0;
      this.metadata['groupId'] = this.metadataInfo.groupId;
      this.metadata['artifactId'] = this.metadataInfo.mavenArtifact;
      this.metadata['version'] = this.metadataInfo.projectVersion;
      this.getMetadata.emit(this.metadata);
    }
    // this.getMetadata.emit(this.metadata);
  }

  public getGroupId(event: any) {
    this.metadata['groupId'] = event.target.value ;
    this.getMetadata.emit(this.metadata);
  }

  public getArtifactId(event: any) {
    this.metadata['artifactId'] = event.target.value ;
    this.getMetadata.emit(this.metadata);
  }

  public getVersion(event: any) {
    this.metadata['version'] = event.target.value ;
    this.getMetadata.emit(this.metadata);
  }
}
