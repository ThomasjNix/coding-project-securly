import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductModule } from './products/product.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [
    ProductModule
  ]
})
export class RoutingModule { }
