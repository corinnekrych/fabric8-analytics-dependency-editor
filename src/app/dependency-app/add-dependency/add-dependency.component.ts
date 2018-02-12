import {
  Component,
  OnInit,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  OnDestroy
} from '@angular/core';
import {
  TagInputModule
} from 'ngx-chips';
import {
  FormsModule
} from '@angular/forms';
import {
  AccordionModule
} from 'ngx-bootstrap';
import {
  ComponentInformationModel,
  DependencySearchItem
} from '../model/data.model';
import {
  DependencyEditorService
} from '../shared/dependency-editor.service';

@Component({
  selector: 'app-add-dependency',
  templateUrl: './add-dependency.component.html',
  styleUrls: ['./add-dependency.component.less']
})

export class AddDependencyComponent implements OnInit, OnDestroy {
  @Input() dependencies: Array < ComponentInformationModel > ;
  public dependencySearchString: string;
  public dependencySearchResult: Array < DependencySearchItem > = [];

  private searchDepsUrl = 'https://recommender.api.openshift.io/api/v1/component-search/';

  constructor(private service: DependencyEditorService) {}

  ngOnInit() {

  }

  getDependencies() {
    console.log('component search string', this.dependencySearchString);
    this.service.getDependencies(this.searchDepsUrl + this.dependencySearchString)
      .subscribe((response: any) => {
        console.log('dependency search result', response);
        this.dependencySearchResult = response['result'];
      });
  }

  listenInputSearch() {
    if (this.dependencySearchString === '') {
      this.dependencySearchResult = [];
    }
  }

  addDependency(depItem: DependencySearchItem) {
    this.dependencySearchResult = [];
    this.dependencySearchString = '';
    this.service.dependencySelected.emit(depItem);
  }

  ngOnDestroy() {
    this.dependencies = [];
    this.dependencySearchResult = [];
    this.dependencySearchString = '';
  }
}