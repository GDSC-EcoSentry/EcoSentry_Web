import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [
    ToolbarComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    NgxSpinnerModule
  ],
  exports: [
    ToolbarComponent,
    NgxSpinnerModule,
  ]
})
export class CoreModule { }
