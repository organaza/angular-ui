import { Directive, HostListener, HostBinding } from '@angular/core';

@Directive({ selector: '[ozDragulaDelayLift]' })
export class DragulaDelayLiftDirective {

    dragDelay = 200; // milliseconds

    @HostBinding('class.gu-lift')
    draggable = false;

    touchTimeout: number;

    @HostListener('touchmove', ['$event'])
    // @HostListener('mousemove', ['$event'])
    onMove(e: Event) {
        if (!this.draggable) {
            e.stopPropagation();
            clearTimeout(this.touchTimeout);
        }
    }

    @HostListener('touchstart', ['$event'])
    // @HostListener('mousedown', ['$event'])
    onDown(e: Event) {
        this.touchTimeout = window.setTimeout(() => {
            this.draggable = true;
        }, this.dragDelay);
    }

    @HostListener('touchend', ['$event'])
    // @HostListener('mouseup', ['$event'])
    onUp(e: Event) {
        clearTimeout(this.touchTimeout);
        this.draggable = false;
    }

    constructor(
    ) {
    }
}
