import { Injectable } from '@angular/core';
import { DependencyEditorTokenProvider } from '../../../projects/fabric8-analytics-dependency-editor/src/lib/shared/depeditor-tokenprovider';
import {environment} from '../../environments/environment';

@Injectable()
export class MockAuthenticationService extends DependencyEditorTokenProvider {
    constructor() {
        super();
    }
    getToken(): string | Promise<string> {
      console.log(`TOKEN: ${environment.OSIO_AUTH_TOKEN}`);
      return environment.OSIO_AUTH_TOKEN || '';
    }
}
