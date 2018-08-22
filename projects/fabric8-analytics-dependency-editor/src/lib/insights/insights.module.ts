import {
    NgModule
} from '@angular/core';
import {
    CommonModule
} from '@angular/common';
import {
    AccordionModule
} from 'ngx-bootstrap';
import {
    HttpClientModule
} from '@angular/common/http';
import {
    FormsModule
} from '@angular/forms';
import {
    ListElementModule
} from '../list-element/list-element.module';
import {
    InsightComponent
} from './insights.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip/tooltip.module';
import { DependencyEditorService } from '../shared/dependency-editor.service';


@NgModule({
    imports: [
        CommonModule,
        AccordionModule.forRoot(),
        TooltipModule.forRoot(),
        HttpClientModule,
        FormsModule,
        ListElementModule
    ],
    declarations: [
        InsightComponent
    ],
    exports: [
        InsightComponent
    ],
    providers: [
        DependencyEditorService
    ]
})
export class InsightModule {}
