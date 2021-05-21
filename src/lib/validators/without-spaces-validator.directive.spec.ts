import { waitForAsync } from '@angular/core/testing';
import { AbstractControl } from '@angular/forms';

import { WithOutSpacesValidatorDirective } from './without-spaces-validator.directive';

describe('WithOutSpacesValidatorDirective', () => {
  let directive: WithOutSpacesValidatorDirective;
  beforeEach(
    waitForAsync(() => {
      directive = new WithOutSpacesValidatorDirective('a');
    }),
  );
  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });
  it('should be valid on A', () => {
    expect(directive.validate({ value: 'A' } as AbstractControl)).toBeNull();
  });
  it('should be valid on A', () => {
    expect(
      directive.validate({ value: '  A  ' } as AbstractControl),
    ).toBeNull();
  });
  it('should be invalid on space char', () => {
    expect(directive.validate({ value: ' ' } as AbstractControl)).toEqual(
      jasmine.objectContaining({
        validateWithoutSpaces: false,
      }),
    );
  });
});
