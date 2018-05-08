import { Directive, forwardRef, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';
import moment from 'moment';


@Directive({
  selector: '[ozValidateDuration][formControlName],[ozValidateDuration][formControl],[ozValidateDuration][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => DurationValidatorDirective), multi: true }
  ]
})
export class DurationValidatorDirective implements Validator {
  constructor( @Attribute('validateDuration') public validateDuration: string) { }


  validate(c: AbstractControl): { [key: string]: any } {
    // self value
    const v = c.value;
    const duration = moment.duration(v);
    if (v && (!moment.isDuration(duration) || duration.asSeconds() === 0)) {
      return {
        validateDuration: false
      };
    }

    return null;
  }
}
