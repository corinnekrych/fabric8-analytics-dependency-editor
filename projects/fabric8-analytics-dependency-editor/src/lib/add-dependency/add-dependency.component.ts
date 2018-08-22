import {
  Component,
  OnInit,
  OnChanges,
  Input,
  ViewEncapsulation,
  OnDestroy,
  ViewChild,
  Host
} from '@angular/core';
import {
  ComponentInformationModel,
  DependencySearchItem,
  DependencySnapshotItem,
  CategorySearchItem,
  CveResponseModel,
  BoosterInfo
} from '../model/data.model';
import { DependencyEditorService } from '../shared/dependency-editor.service';
import { ErrorMessageHandler } from '../shared/error-message-handler';
import { DependencySnapshot } from '../utils/dependency-snapshot';
import { Subscription } from 'rxjs';
import { SimpleChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { TelemetryService } from '../shared/telemetry.service';
import { DependencyEditorComponent } from '../dependency-editor/dependency-editor.component';

@Component({
  selector: 'app-add-dependency',
  styleUrls: ['./add-dependency.component.less'],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './add-dependency.component.html'
})

export class AddDependencyComponent implements OnInit, OnDestroy, OnChanges {
  @Input() boosterInfo: BoosterInfo;
  @Input() dependencies: Array < ComponentInformationModel > ;
  @Input() dependencyAdded: Array < DependencySnapshotItem > ;
  @Input() existDependencies: Array < DependencySnapshotItem > ;
  @ViewChild('PackagePreview') modalPackagePreview: any;

  public queryString: any;
  public categoryString: string;
  public dependencySearchString: string;
  public dependencySearchResult: Array < DependencySearchItem > = [];
  public isLoading = false;
  public categorySearchResult: Array < CategorySearchItem > = [];
  public categoryResult: Array<any> = [];
  public tagZero = 0;
  public errorSecurity: string;
  public errorCategories: string;
  public errorComponentSearch: string;
  
  public masterTags: Array < any > = [];
  public categories: Array<any> = [];
  public cveTemporaryData: CveResponseModel;
  public cveName: any = [];
  public noOfTags = 0;
  public saveTagname: Array<any> = [];
  public type = false;
  public tags: Array < any > = [];
  public toast = false;

  public categoriesStore: Array<any> = [];

  private addDependencySubscription: Subscription = null;

  constructor(
    @Host() private dependencyEditorComponent: DependencyEditorComponent,
    private service: DependencyEditorService,
    private errorMessageHandler: ErrorMessageHandler,
    private telemetryService: TelemetryService) {}

  ngOnInit() {
    this.masterTags = [];
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes['boosterInfo'] && changes['boosterInfo']['currentValue']) {
      this.resetValues();
      this.getCategories();
    }
    if (changes && changes['existDependencies'] && changes['existDependencies']['currentValue']) {
      this.masterTags = [];
      this.addedTags();
    }
  }

  resetValues(): void {
    this.categoryResult = [];
    this.masterTags = [];
  }

  getDependencies() {
    if (!this.dependencySearchString) {
      return;
    }
    this.isLoading = true;
    if (this.addDependencySubscription) {
      this.addDependencySubscription.unsubscribe();
    }
    this.addDependencySubscription = this.service.getDependencies(this.dependencySearchString)
                                                  .subscribe((response: any) => {
                                                    this.dependencySearchResult = response['result'];
                                                    this.isLoading = false;
                                                  }, (error: any) => {
                                                    this.errorComponentSearch = this.errorMessageHandler.getErrorMessage(error.status);
                                                    this.isLoading = false;
                                                    console.log('error component search - ', this.errorComponentSearch);
                                                });
  }

  /**
   *
   * @param packages [Array<any>]
   * @returns count [number]
   *
   * This function checks for the packages and ignores if they are the part of core dependencies
   */
  getPackageCount(packages: Array<any>): number {
    return packages && packages.filter((p: any) => !this.isACoreDependency(p.name)).length || 0;
  }

  handleModalCategories(categories: any): void {
    if (!categories) {
      return;
    }

    this.categorySearchResult = categories;
    this.isLoading = false;
    if (this.categoryResult.length === 0) {
      this.categoriesStore.push({
        isOpened: true
      });

      for (const key in this.categorySearchResult) {
        if (this.categorySearchResult.hasOwnProperty(key)) {
          this.categoryResult.push(this.categorySearchResult[key]);
          this.categoriesStore.push({
            isOpened: false
          });
        }
      }
    }
    if (this.masterTags.length === 0) {
      const p = this.getCategoryPayload(this.categoryResult);
      this.getCategoriesSecurity(p);
    }

    if (this.existDependencies) {
      this.addedTags();
    }
  }

  getCategories() {
    if (this.boosterInfo) {
      this.isLoading = true;
      let runtime = '';
      if (this.boosterInfo.runtime.id === 'vert.x') {
        runtime = 'vertx';
      } else if (this.boosterInfo.runtime.id === 'spring-boot') {
        runtime = 'springboot';
      } else if (this.boosterInfo.runtime.id === 'thorntail') {
        runtime = 'thorntail';
      }
      if (runtime) {
        this.service.getCategories(runtime)
          .subscribe((response: any) => {
            this.handleModalCategories(response['categories']);
          }, (error: any) => {
            // Handle server errors here
            this.isLoading = false;
            this.errorCategories =  this.errorMessageHandler.getErrorMessage(error.status);
            console.log('error categories - ', this.errorCategories);
        });
      }
    }
  }

  resetCategoryStore(fromIndex: number): void {
    for (let i = fromIndex; i < this.categoriesStore.length; ++ i) {
      if (this.categoriesStore[i].isOpened) {
        this.categoriesStore[i].isOpened = false;
      }
    }
  }

  getCategoryPayload(categoryResult: any) {
    const payload: any = {};
    const j = 0;
    const category: any = [];
    categoryResult.forEach((i: any) => {
      i.packages.forEach((k: any) => {
        category.push({
          'package' : k.name,
          'version' : k.version
        });
      });
    });
    payload['_resolved'] = category;
    payload['ecosystem'] = DependencySnapshot.ECOSYSTEM;
    payload['request_id'] = DependencySnapshot.REQUEST_ID;
    return payload;
  }

  getCategoriesSecurity(payload: any) {
    this.service.getDependencyData('CVE', payload)
      .subscribe((response: CveResponseModel) => {
        this.cveTemporaryData = response;
        if (this.cveTemporaryData) {
          let count = -1;
          this.cveTemporaryData.result.forEach((item: any) => {
            count++;
            if (item.cve) {
              if (item.cve !== null) {
                this.cveName.push({
                  'detail' : item.cve.details, // cve:
                  'package': item.package
                });
              }
            }
          });
        }
      }, (error: any) => {
        // Handle server errors here
        this.errorSecurity = this.errorMessageHandler.getErrorMessage(error.status);
        console.log('error add security - ', this.errorSecurity);
    });
      this.masterTags.forEach( (i: any) => {
        for (let j = 0; j < this.cveName.length; j++) {
          if (i.name === this.cveName['j'].package) {
            i.security = this.cveName['j'].detail;
          }
        }
      });
  }

  changeTagname(master: any, t: boolean) {
    this.type = !t;
    for (let i = 0; i < this.masterTags.length; i++) {
      if (this.masterTags[i].name === master.name
        && this.masterTags[i].version === master.version
        && this.masterTags[i].category === master.category) {
        this.type = !t;
       if (this.masterTags[i].type === true && this.type === true) {
         continue;
       } else if (this.masterTags[i].type === true && this.type === false) {
         this.masterTags[i].type = false;
           this.noOfTags--;
           i++;
           break;
         } else if (this.masterTags[i].type === false) {
         if (this.type === true) {
           this.masterTags[i].type = true;
           this.noOfTags++;
           break;
         } else if (this.type === false) {
           this.masterTags[i].type = false;
           this.noOfTags--;
           break;
         }
       }
     }
    }
  }

  listenInputSearch() {
    if (this.dependencySearchString === '') {
      this.dependencySearchResult = [];
    }
  }

  addDependency() {
    this.dependencySearchResult = [];
    this.dependencySearchString = '';
    this.noOfTags = 0;
    this.saveTagname = [];
    let currentTag: any = null;
    for (let i = 0; i < this.masterTags.length; i++) {
      currentTag = this.masterTags[i];
      if (currentTag.type === true) {
        this.tags = [];
        this.tags.push({
          'ecosystem' : DependencySnapshot.ECOSYSTEM,
          'version' : currentTag.version,
          'name' : currentTag.name,
          'category': currentTag.category
        });
        this.saveTagname.push({
          'name': this.masterTags[i].name
        });
        this.toast = true;
        this.masterTags[i].grouped = true;
        this.masterTags[i].type = false;
        this.service.dependencySelected.emit(this.tags[0]);
      }
    }
  }

  addSearchDependency(depItem: DependencySearchItem) {
    this.dependencySearchResult = [];
    this.dependencySearchString = '';
    this.service.dependencySelected.emit(depItem);
  }

  ngOnDestroy() {
    this.dependencies = [];
    this.dependencySearchResult = [];
    this.categorySearchResult = [];
    this.categoryResult = [];
    this.dependencySearchString = '';
    this.isLoading = false;
  }

  removeDependency(dependency: any) {
    this.service.removeDependency(dependency);
  }

  public showPackageModal(event: Event) {
    this.toast = false;
    this.modalPackagePreview.open();
    this.handleModalCategories(this.categorySearchResult);
    this.telemetryService.broadcast(this.dependencyEditorComponent.broadcaster, 'browseAllDependenciesClicked');
  }

  public closemodal() {
    this.modalPackagePreview.close();
  }

  public showDependency() {
  }

  handleUserInputKeyPress(event: KeyboardEvent): void {
  }

  public handleCategoryClick(tag: string, index: number) {
    this.queryString = '';
    this.categoryString = tag + '$$' + true;
    this.resetCategoryStore(0);
    this.categoriesStore[index].isOpened = true;
  }

  public setToObject(container: any, currentPackage: any): void {
    if (container && currentPackage) {
      if (!container[currentPackage.name]) {
        container[currentPackage.name] = {
          'version' : currentPackage.version,
          'name' : currentPackage.name,
          'description': currentPackage.description,
          'category' : [currentPackage.category],
          'type' : false,
          'grouped' : false,
          'security' : null,
          'present' : false
        };
      } else {
        if (container[currentPackage.name]['category'].indexOf(currentPackage.category) === -1) {
          container[currentPackage.name]['category'].push(currentPackage.category);
        }
      }
    }
  }

  public addedTags() {
    if (this.masterTags.length === 0) {
      let count = 0;
      this.tagZero = 0;
      let packs: any = {};
      this.categoryResult.forEach((i: any) => {
        i.packages.forEach((x: any) => {
          if (!this.isACoreDependency(x.name)) {
            this.setToObject(packs, x);
          }
        });
      });
      Object.keys(packs).forEach((name: string) => {
        ++ count;
        packs[name]['ecosystem'] = DependencySnapshot.ECOSYSTEM;
        this.masterTags.push(packs[name]);
      });
      this.tagZero = count;
    }
    this.categoryResult.forEach((i: any) => {
        i.packages.forEach((x: any) => {
            this.saveTagname.push({'name' : x, 'type' : false});
        });
    });
  for (let i = 0; i < this.masterTags.length; i++) {
    this.masterTags[i].present = false;
  }
  if (DependencySnapshot.DEP_FULL_ADDED.length === 0) {
    for (let i = 0; i < this.masterTags.length; i++) {
      this.masterTags[i].grouped = false;
    }
  } else {
    DependencySnapshot.DEP_FULL_ADDED.forEach((depAdded: any) => {
      for (let i = 0; i < this.masterTags.length; i++) {
        if (this.masterTags[i].name === depAdded.name && this.masterTags[i].version === depAdded.version && this.masterTags[i].category === depAdded.category) {
          this.masterTags[i].grouped = true;
          this.masterTags[i].present = true;
        } else {
          if (this.masterTags[i].present !== true) {
            this.masterTags[i].grouped = false;
          }
        }
      }
    });
  }
  }

  searchDependenciesClicked() {
    this.telemetryService.broadcast(this.dependencyEditorComponent.broadcaster, 'searchDependenciesClicked');
  }

  private isACoreDependency(name: string): boolean {
    return this.existDependencies && this.existDependencies.filter((a: DependencySnapshotItem) => a.package === name).length !== 0;
  }
}
