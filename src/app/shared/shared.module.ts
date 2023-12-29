import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { TextInputComponent } from './text-input/text-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import {MatDividerModule} from '@angular/material/divider';



@NgModule({
  declarations: [
    TextInputComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDividerModule
  ],
  exports: [
    MatIconModule,
    MatButtonModule,
    TextInputComponent,
    ReactiveFormsModule,
    MatDividerModule
  ]
})
export class SharedModule { }
