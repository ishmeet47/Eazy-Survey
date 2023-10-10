// date-validator.directive.ts
import { Directive, forwardRef } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, Validator } from '@angular/forms';

@Directive({
  selector: '[dateValidator][ngModel]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => DateValidatorDirective),
    multi: true
  }]
})
export class DateValidatorDirective implements Validator {
  validate(control: AbstractControl): { [key: string]: boolean } | null {
    const currentDate = new Date();
    const controlDate = new Date(control.value);

    if (controlDate < currentDate) {
      return { 'dateInvalid': true };
    }
    return null;
  }
}
