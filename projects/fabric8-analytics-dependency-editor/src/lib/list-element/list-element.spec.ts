import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListElementComponent } from './list-element.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TooltipModule } from 'ngx-bootstrap';
import { URLProvider } from '../shared/url-provider';
import { DependencyEditorTokenProvider } from '../shared/depeditor-tokenprovider';
import { DependencyEditorService } from '../shared/dependency-editor.service';
import { InterceptorService } from '../shared/interceptor-service';
import { TelemetryService } from '../shared/telemetry.service';
import { InsightComponent } from '../insights/insights.component';

describe('ListElementComponent', () => {
  let component: ListElementComponent;
  let fixture: ComponentFixture<ListElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
         CommonModule,
         HttpClientModule,
         FormsModule,
         TooltipModule.forRoot()
     ],
      declarations: [
         ListElementComponent
     ],
      providers: [
        URLProvider,
        InterceptorService,
        DependencyEditorTokenProvider,
        DependencyEditorService,
        TelemetryService,
        {
          provide: InsightComponent, useValue: {}
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
