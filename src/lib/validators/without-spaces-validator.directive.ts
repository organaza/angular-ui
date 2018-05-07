import { Directive, forwardRef, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS, FormControl } from '@angular/forms';


@Directive({
  selector: '[ozValidateWithOutSpaces][formControlName],[ozValidateWithOutSpaces][formControl],[ozValidateWithOutSpaces][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => WithOutSpacesValidatorDirective), multi: true }
  ]
})
export class WithOutSpacesValidatorDirective implements Validator {
  constructor( @Attribute('validateWithOutSpaces') public validateWithOutSpaces: string) { }

  validate(c: AbstractControl): { [key: string]: any } {
    // self value
    const v = c.value;

    if (v && v.trim().length === 0) {
      return {
        validateWithoutSpaces: false
      };
    }

    return null;
  }
}
