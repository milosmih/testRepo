import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { addDateSuffix } from 'src/app/utils/date-and-time/date-and-time.legacy-utils';

@Pipe({
  name: 'shiftDateTimeFormat',
  standalone: true
})
export class ShiftDateTimeFormatPipe implements PipeTransform {

  constructor(private datePipe: DatePipe) {
  }

  transform(shiftStartDateAndTime: string, shiftEndDateAndTime: string): string { 
    if (!shiftStartDateAndTime || !shiftEndDateAndTime) {
      return '';
    }
    
    const startMonthAndWeekFormat: string = this.formatStartMonthAndWeekFormat(shiftStartDateAndTime);
    const startTime: string = this.datePipe.transform(shiftStartDateAndTime, 'HH:mm');
    const endTime: string = this.datePipe.transform(shiftEndDateAndTime, 'HH:mm')

    return `${startMonthAndWeekFormat} | ${startTime} - ${endTime}`;
  }

  private formatStartMonthAndWeekFormat(date: string): string {
    const dateTime = new Date(date);
    const formattedDate: string = this.datePipe.transform(dateTime, 'EEE, MMM d');
    return formattedDate + addDateSuffix(dateTime.getDate());
  }

}
