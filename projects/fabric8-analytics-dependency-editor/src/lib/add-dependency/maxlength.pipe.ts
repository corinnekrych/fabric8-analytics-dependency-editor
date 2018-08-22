
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'maxLength'
})
export class MaxLengthPipe implements PipeTransform {
    transform(value: string, maxWords: number) {
        return value && value.split(' ').splice(0, maxWords).join(' ').toString() || '';
    }
}
