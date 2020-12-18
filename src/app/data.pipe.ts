import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dataT'
})
export class DataPipe implements PipeTransform
{
    transform(value: any, args?: any): any
    {
        const m = [
            'Январь',
            'Февраль',
            'Март',
            'Апрель',
            'Май',
            'Июнь',
            'Июль',
            'Август',
            'Сентябрь',
            'Октябрь',
            'Ноябрь',
            'Декабрь'
        ];

        return m[value];
    }

}
