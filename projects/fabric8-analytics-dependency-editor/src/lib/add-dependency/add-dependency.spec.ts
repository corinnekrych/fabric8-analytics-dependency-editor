import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDependencyComponent } from './add-dependency.component';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'ngx-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-modal';
import { ListElementModule } from '../list-element/list-element.module';
import { FilterPipe } from './add-dependency.pipe';
import { MaxLengthPipe } from './maxlength.pipe';
import { DependencyEditorService } from '../shared/dependency-editor.service';
import { URLProvider } from '../shared/url-provider';
import { DependencyEditorTokenProvider } from '../shared/depeditor-tokenprovider';
import { ErrorMessageHandler } from '../shared/error-message-handler';
import { TooltipModule } from 'ngx-bootstrap/tooltip/tooltip.module';
import { InterceptorService } from '../shared/interceptor-service';
import { TelemetryService } from '../shared/telemetry.service';
import { DependencyEditorComponent } from '../dependency-editor/dependency-editor.component';

describe('AddDependencyComponent', () => {
  let component: AddDependencyComponent;
  let fixture: ComponentFixture<AddDependencyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        AccordionModule.forRoot(),
        TooltipModule.forRoot(),
        HttpClientModule,
        FormsModule,
        ModalModule,
        ListElementModule
    ],
     declarations: [
        AddDependencyComponent,
        FilterPipe,
        MaxLengthPipe
    ],
     providers: [
      URLProvider,
      DependencyEditorTokenProvider,
      InterceptorService,
      DependencyEditorService,
      ErrorMessageHandler,
      TelemetryService,
      {
        provide: DependencyEditorComponent, useValue: {}
      }
     ]
     }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDependencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
