
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'FilterPipe'
})
export class FilterPipe implements PipeTransform {
    transform(value: any, input: string) {
        if (input && value) {
            if (input.indexOf('$$') !== -1) {
                let cat = input.split('$$')[0];
                if (cat !== 'All') {
                    return value.filter((i: any) => i.category.indexOf(cat) !== -1);
                }
                return value;
            }
            input = input.toLowerCase();
            return value.filter(function (el: any) {
                return el.name.toLowerCase().indexOf(input) > -1;
            });
        }
        return value;
    }
}
