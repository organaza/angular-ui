/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  EmbeddedViewRef,
} from '@angular/core';

@Directive({
  selector: '[ngLet]',
})
export class LetDirective {
  _ref: EmbeddedViewRef<unknown>;
  context: unknown = {};

  @Input()
  set ngLet(value: unknown) {
    // if embeadded view doesn't exist yet create it (only once)
    if (!this._ref) this.createView();

    // if value is empty destroy the component
    // here it's acctualy works like ngIf (will rerender on non-empty value)
    if (!value) {
      this._ref.destroy();
      this._ref = undefined;

      return;
    }

    // add the value to the context
    (this._ref.context as any).$implicit = (this.context as any).ngLet = value;
  }

  constructor(
    private readonly vcRef: ViewContainerRef,
    private readonly templateRef: TemplateRef<unknown>,
  ) {}

  createView(): void {
    this.vcRef.clear();
    this._ref = this.vcRef.createEmbeddedView(this.templateRef, this.context);
  }
}
