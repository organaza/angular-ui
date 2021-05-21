import { waitForAsync } from '@angular/core/testing';
import { AbstractControl } from '@angular/forms';

import { DurationValidatorDirective } from './duration-validator.directive';

describe('DurationValidatorDirective', () => {
  let directive: DurationValidatorDirective;
  beforeEach(
    waitForAsync(() => {
      directive = new DurationValidatorDirective('a');
    }),
  );
  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });
  it('should be valid on PT2H', () => {
    expect(directive.validate({ value: 'PT2H' } as AbstractControl)).toBeNull();
  });
  it('should be valid on PT2H5M', () => {
    expect(
      directive.validate({ value: 'PT2H5M' } as AbstractControl),
    ).toBeNull();
  });
  it('should be invalid on 458', () => {
    expect(directive.validate({ value: '458' } as AbstractControl)).toEqual(
      jasmine.objectContaining({
        validateDuration: false,
      }),
    );
  });
  it('should be invalid on abc', () => {
    expect(directive.validate({ value: 'abc' } as AbstractControl)).toEqual(
      jasmine.objectContaining({
        validateDuration: false,
      }),
    );
  });
});
