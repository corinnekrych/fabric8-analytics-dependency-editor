import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightComponent } from './insights.component';
import { CommonModule } from '@angular/common';
import { AccordionModule, TooltipModule } from 'ngx-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ListElementModule } from '../list-element/list-element.module';
import { DependencyEditorService } from '../shared/dependency-editor.service';
import { InterceptorService } from '../shared/interceptor-service';
import { URLProvider } from '../shared/url-provider';
import { DependencyEditorTokenProvider } from '../shared/depeditor-tokenprovider';
import { TelemetryService } from '../shared/telemetry.service';
import { DependencyEditorComponent } from '../dependency-editor/dependency-editor.component';

describe('InsightComponent', () => {
  let component: InsightComponent;
  let fixture: ComponentFixture<InsightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
          CommonModule,
          AccordionModule.forRoot(),
          TooltipModule.forRoot(),
          HttpClientModule,
          FormsModule,
          ListElementModule
      ],
      declarations: [
          InsightComponent
      ],
      providers: [
        DependencyEditorService,
        InterceptorService,
        URLProvider,
        DependencyEditorTokenProvider,
        TelemetryService,
        {
          provide: DependencyEditorComponent, useValue: {}
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
