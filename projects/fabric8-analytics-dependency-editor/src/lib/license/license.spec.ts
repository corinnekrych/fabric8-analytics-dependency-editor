import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentprojectComponent } from '../current-project/current-project.component';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'ngx-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AlertBoxModule } from '../alert-box/alert-box.module';
import { LicenseComponent } from './license.component';

import { DependencyEditorService } from '../shared/dependency-editor.service';
import { InterceptorService } from '../shared/interceptor-service';
import { URLProvider } from '../shared/url-provider';
import { DependencyEditorTokenProvider } from '../shared/depeditor-tokenprovider';

describe('LicenseComponent', () => {
  let component: LicenseComponent;
  let fixture: ComponentFixture<LicenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        AccordionModule.forRoot(),
        HttpClientModule,
        FormsModule,
        AlertBoxModule
     ],
      declarations: [
        LicenseComponent
     ],
     providers: [
      InterceptorService,
      DependencyEditorService,
      URLProvider,
      DependencyEditorTokenProvider
     ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LicenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
