import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewProductComponent } from './new-product/new-product.component';
import { ProductListComponent } from './product-list/product-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductRoutingModule } from './product-routing.module';
import { IndeterminateDirective } from './shared/indeterminate.directive';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    NewProductComponent,
    ProductListComponent,
    IndeterminateDirective
  ],
  imports: [
    ProductRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule
  ]
})
export class ProductModule { }
