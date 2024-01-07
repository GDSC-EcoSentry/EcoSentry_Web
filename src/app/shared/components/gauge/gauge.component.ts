import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-gauge',
  templateUrl: './gauge.component.html',
  styleUrls: ['./gauge.component.scss']
})
export class GaugeComponent {
  @Input() label!: string;
  @Input() append!: string | '';
  @Input() max!: number;
  @Input() value!: number;
  @Input() thresholdConfig!: any;
}
