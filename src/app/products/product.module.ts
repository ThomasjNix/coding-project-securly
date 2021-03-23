import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewProductComponent } from './new-product/new-product.component';
import { ProductListComponent } from './product-list/product-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductRoutingModule } from './product-routing.module';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    NewProductComponent,
    ProductListComponent
  ],
  imports: [
    ProductRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class ProductModule { }
