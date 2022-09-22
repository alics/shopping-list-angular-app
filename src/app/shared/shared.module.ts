import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AlertComponent } from './alert/alert.component';
import { DropdownDirective } from './dropdown.directive';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { ViewHostDirective } from './placeholder/view-host.directive';

@NgModule({
    declarations: [
        AlertComponent,
        LoadingSpinnerComponent,
        ViewHostDirective,
        DropdownDirective
    ],
    imports: [
        CommonModule
    ],
    exports: [
        AlertComponent,
        LoadingSpinnerComponent,
        ViewHostDirective,
        DropdownDirective,
        CommonModule
    ]
})
export class SharedModule {

}