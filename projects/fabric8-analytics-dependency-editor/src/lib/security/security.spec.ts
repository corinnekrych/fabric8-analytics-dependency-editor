import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityComponent } from './security.component';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'ngx-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AlertBoxModule } from '../alert-box/alert-box.module';
import { DependencyEditorService } from '../shared/dependency-editor.service';
import { InterceptorService } from '../shared/interceptor-service';
import { DependencyEditorTokenProvider } from '../shared/depeditor-tokenprovider';
import { URLProvider } from '../shared/url-provider';

describe('SecurityComponent', () => {
  let component: SecurityComponent;
  let fixture: ComponentFixture<SecurityComponent>;

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
        SecurityComponent
     ],
     providers: [
      InterceptorService,
      DependencyEditorService,
      DependencyEditorTokenProvider,
      URLProvider
     ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
