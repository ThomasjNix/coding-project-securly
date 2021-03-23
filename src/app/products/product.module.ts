import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewProductComponent } from './new-product/new-product.component';
import { ProductListComponent } from './product-list/product-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductRoutingModule } from './product-routing.module';

@NgModule({
  declarations: [
    NewProductComponent,
    ProductListComponent
  ],
  imports: [
    ProductRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ProductModule { }
