import { Component, Input, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';

@Component({
  selector: 'app-text-autocomplete',
  templateUrl: './text-autocomplete.component.html',
  styleUrls: ['./text-autocomplete.component.scss']
})
export class TextAutocompleteComponent implements ControlValueAccessor{
  @Input() type = 'text';
  @Input() label = '';
  @Input()
  autocomplete!: MatAutocomplete;
  constructor(@Self() public controlDir: NgControl) {
    this.controlDir.valueAccessor = this;
  }

  writeValue(obj: any): void {
  }
  registerOnChange(fn: any): void {
  }
  registerOnTouched(fn: any): void {
  }

  get control(): FormControl {
    return this.controlDir.control as FormControl
  }
}
