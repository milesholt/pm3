import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[dynamic-comp]',
})
export class DynamicCompDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
