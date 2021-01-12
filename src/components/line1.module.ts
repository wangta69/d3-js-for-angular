import { CommonModule, DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { LineChartComponent } from './line1-component';

@NgModule({
    imports: [
        CommonModule
    ],
    providers: [

    ],
    declarations: [
        LineChartComponent,
    ],
    exports: [
        LineChartComponent,
    ]
})
export class LineChartModule { }
