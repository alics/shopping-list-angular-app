import { Directive, ViewContainerRef } from '@angular/core';

/**
 * Directive necessary for dynamic element hosting in the activity page.
 */
@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[viewHost]'
})
export class ViewHostDirective {

    /**
     * @ignore DI constructor
     */
    constructor(public container: ViewContainerRef) {}

}
