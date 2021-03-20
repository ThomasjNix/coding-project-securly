import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './products/product-list/product-list.component';
import { NewProductComponent } from './products/new-product/new-product.component';

const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'add-product', component: NewProductComponent},
  { path: '**', component: ProductListComponent }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class RoutingModule { }
