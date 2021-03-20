import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewProductComponent } from './new-product/new-product.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductRoutingModule } from './product-routing.module';

@NgModule({
  declarations: [
    NewProductComponent,
    ProductListComponent
  ],
  imports: [
    ProductRoutingModule,
    CommonModule,
    ReactiveFormsModule
  ]
})
export class ProductModule { }
