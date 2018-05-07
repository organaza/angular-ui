import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithOutSpacesValidatorDirective } from './without-spaces-validator.directive';

describe('WithOutSpacesValidatorDirective', () => {
  let directive;
  beforeEach(async(() => {
    directive = new WithOutSpacesValidatorDirective('a');
  }));
  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });
  it('should be valid on A', () => {
    expect(directive.validate({value: 'A'})).toBeNull();
  });
  it('should be valid on A', () => {
    expect(directive.validate({value: '  A  '})).toBeNull();
  });
  it('should be invalid on space char', () => {
    expect(directive.validate({value: ' '})).toEqual(jasmine.objectContaining({
      validateWithoutSpaces: false
    }));
  });
});
