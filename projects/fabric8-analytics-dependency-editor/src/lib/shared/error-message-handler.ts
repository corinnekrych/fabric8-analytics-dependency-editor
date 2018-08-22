import { Injectable } from '@angular/core';

@Injectable()
export class ErrorMessageHandler {
    getErrorMessage(errorStatus: number): string {
        let ERROR_HASH: any = {
            '400': 'The request is not proper',
            '401': 'Authentication failed - could not decode JWT token',
            '403': 'No Permission to Access',
            '404': 'The request is not proper',
            '405': 'The method is not allowed for the requested URL',
            '500': 'Server responded with error Retry again later',
            '501': 'Server responded with error Retry again later',
            '502': 'The server encountered a temporary error and could not complete your request',
            '504': 'Gateway Timeout, try again later'
          };
          return ERROR_HASH[errorStatus];
    }
}
