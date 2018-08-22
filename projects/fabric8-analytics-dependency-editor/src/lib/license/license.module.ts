import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'ngx-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AlertBoxModule } from '../alert-box/alert-box.module';
import { LicenseComponent } from './license.component';


@NgModule({
 imports: [
    CommonModule,
    AccordionModule.forRoot(),
    HttpClientModule,
    FormsModule,
    AlertBoxModule
],
 declarations: [
    LicenseComponent
],
 exports: [
    LicenseComponent
],
    providers: []
})
export class LicenseModule {}
