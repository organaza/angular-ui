import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DurationValidatorDirective } from './duration-validator.directive';

describe('DurationValidatorDirective', () => {
  let directive;
  beforeEach(async(() => {
    directive = new DurationValidatorDirective('a');
  }));
  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });
  it('should be valid on PT2H', () => {
    expect(directive.validate({value: 'PT2H'})).toBeNull();
  });
  it('should be valid on PT2H5M', () => {
    expect(directive.validate({value: 'PT2H5M'})).toBeNull();
  });
  it('should be invalid on 458', () => {
    expect(directive.validate({value: '458'})).toEqual(jasmine.objectContaining({
      validateDuration: false
    }));
  });
  it('should be invalid on abc', () => {
    expect(directive.validate({value: 'abc'})).toEqual(jasmine.objectContaining({
      validateDuration: false
    }));
  });
});
