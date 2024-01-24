// date-validator.directive.ts
import { Directive, forwardRef } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, Validator } from '@angular/forms';

@Directive({
  selector: '[dateValidator][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DateValidatorDirective),
      multi: true,
    },
  ],
})
export class DateValidatorDirective implements Validator {
  validate(control: AbstractControl): { [key: string]: boolean } | null {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set the time to midnight

    const controlDate = new Date(control.value);
    controlDate.setHours(0, 0, 0, 0); // Set the time to midnight

    if (controlDate < currentDate) {
      return { dateInvalid: true };
    }
    return null;
  }
}
