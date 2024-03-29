import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { TextInputComponent } from './components/text-input/text-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatDividerModule} from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { PagerComponent } from './components/pager/pager.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import {MatSelectModule} from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { TextAutocompleteComponent } from './components/text-autocomplete/text-autocomplete.component';
import {MatListModule} from '@angular/material/list';
import { MapComponent } from './components/map/map.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { NodeMapComponent } from './components/node-map/node-map.component';
import { NgxGaugeModule } from 'ngx-gauge';
import { GaugeComponent } from './components/gauge/gauge.component';
import { ChartComponent } from './components/chart/chart.component';
import { NgApexchartsModule } from 'ng-apexcharts';

@NgModule({
  declarations: [
    TextInputComponent,
    PagerComponent,
    TextAutocompleteComponent,
    MapComponent,
    NodeMapComponent,
    GaugeComponent,
    ChartComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    PaginationModule.forRoot(),
    MatSelectModule,
    MatAutocompleteModule,
    GoogleMapsModule,
    NgxGaugeModule,
    NgApexchartsModule,
  ],
  exports: [
    MatIconModule,
    MatButtonModule,
    TextInputComponent,
    ReactiveFormsModule,
    MatDividerModule,
    MatToolbarModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    PaginationModule,
    FormsModule,
    MatSelectModule,
    MatAutocompleteModule,
    TextAutocompleteComponent,
    MatListModule,
    PagerComponent,
    GoogleMapsModule,
    MapComponent,
    NodeMapComponent,
    NgxGaugeModule,
    GaugeComponent,
    ChartComponent,
  ]
})
export class SharedModule { }
