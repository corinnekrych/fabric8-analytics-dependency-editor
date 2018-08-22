import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AnalyticsUrlService } from './shared/analytics-url.service';

import { AppComponent } from './app.component';
import { DependencyEditorModule }
from '../../projects/fabric8-analytics-dependency-editor/src/lib/dependency-editor/dependency-editor.module';
import { URLProvider } from '../../projects/fabric8-analytics-dependency-editor/src/lib/shared/url-provider';
import { DependencyEditorTokenProvider } from '../../projects/fabric8-analytics-dependency-editor/src/lib/shared/depeditor-tokenprovider';
import { MockAuthenticationService } from './shared/mock-auth-service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    DependencyEditorModule
  ],
  providers: [
    { provide: URLProvider, useClass: AnalyticsUrlService },
    { provide: DependencyEditorTokenProvider, useClass: MockAuthenticationService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
