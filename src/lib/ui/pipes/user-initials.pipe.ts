import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userInitials',
  standalone: true
})
export class UserInitialsPipe implements PipeTransform {
  transform(value?: { firstName: string; lastName: string }): string {
    if (value && value.firstName && value.lastName) {
      return value.firstName.charAt(0) + value.lastName.charAt(0);
    }

    return '';
  }
}
