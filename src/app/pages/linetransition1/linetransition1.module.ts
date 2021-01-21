import { CommonModule, DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LineTransitonComponent } from './linetransition1.component';

@NgModule({
    imports: [
        CommonModule,

        RouterModule.forChild([
            {
        path: '',
        component: LineTransitonComponent
        }
        ]),
    ],
    providers: [
    ],
    declarations: [
        LineTransitonComponent,
    ],
    exports: [
    //    LineTransitonComponent,
    ]
})
export class LineTransitoin1Module { }
