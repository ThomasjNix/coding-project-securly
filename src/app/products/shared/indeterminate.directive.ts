import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[indeterminate]'
})
export class IndeterminateDirective {

  constructor(private element: ElementRef) { }

  @Input() set indeterminate(value) {
    this.element.nativeElement.indeterminate = value;
  }

}
