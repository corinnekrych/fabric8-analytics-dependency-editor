import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Host
} from '@angular/core';
import {
  FormsModule
} from '@angular/forms';
import {
  AccordionModule
} from 'ngx-bootstrap';
import * as _ from 'lodash';

import { ComponentInformationModel, StackReportModel, EventDataModel } from '../model/data.model';
import { DependencyEditorService } from '../shared/dependency-editor.service';
import { DependencySnapshot } from '../utils/dependency-snapshot';
import { TelemetryService } from '../shared/telemetry.service';
import { InsightComponent } from '../insights/insights.component';

@Component({
  selector: 'app-list-element',
  styleUrls: ['./list-element.component.less'],
  templateUrl: './list-element.component.html'
})

export class ListElementComponent implements OnInit {
  @Input() dependency: ComponentInformationModel;
  @Input() fromAddDependency: string;
  @Output() companionAdded = new EventEmitter<ComponentInformationModel> ();
  @Output() tagAdded = new EventEmitter<any> ();
  @Output() companionReleased = new EventEmitter<ComponentInformationModel> ();
  @Output() companionRemoved = new EventEmitter<ComponentInformationModel> ();

  public dep: Array<any> = [];
  public showAlternateSection = false;
  public saveTagname = false;
  public isOpen = false;

  constructor(
    @Host() private insightComponent: InsightComponent,
    private service: DependencyEditorService,
    private telemetryService: TelemetryService) {
  }

  ngOnInit() {
    if (this.dependency && this.dependency.alternate) {
      this.showAlternateSection = true;
    }
  }

  validateValues(value: any): string {
    if (value < 0) {
      return 'NA';
    }
    return value;
  }

  changeTagname(saveTag: boolean) {
    this.saveTagname = !saveTag;
    this.dep.splice(0);
    this.dep.push({name: this.dependency , type: this.saveTagname});
    if (this.saveTagname === true) {
      this.tagAdded.emit(this.dep);
      this.companionAdded.emit(this.dependency);
    } else {
      this.tagAdded.emit(this.dep);
      this.companionReleased.emit(this.dependency);
    }
  }

  addDependency() {
    const objToEmit: EventDataModel = {
      depFull: this.dependency,
      depSnapshot: null,
      action: 'add'
    };
  }

  removeCompanion() {
    this.telemetryService.broadcast(this.insightComponent.dependencyEditorComponent.broadcaster, 'companionDependencyRemoved');
    this.companionRemoved.emit(this.dependency);
  }

  removeDependency() {
    this.telemetryService.broadcast(this.insightComponent.dependencyEditorComponent.broadcaster, 'browsedDependencyRemoved');
    this.service.removeDependency(this.dependency);
  }

  useAlternate() {
    const alternate: any = this.dependency.alternate;
    const indexFull: any = _.findIndex(DependencySnapshot.DEP_FULL_ADDED, { name: alternate.name });
    const indexSnapshot: any = _.findIndex(DependencySnapshot.DEP_SNAPSHOT_ADDED, { package: alternate.name });
    DependencySnapshot.DEP_FULL_ADDED.splice(indexFull, 1, alternate.alternate);
    DependencySnapshot.DEP_SNAPSHOT_ADDED.splice(indexSnapshot, 1, {
      package: alternate.alternate.name,
      version: alternate.alternate.version
    });
    this.showAlternateSection = false;
  }

  ignoreAlternate() {
    this.showAlternateSection = false;
  }
}
