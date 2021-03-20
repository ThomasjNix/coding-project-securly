import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Product } from '../product';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  productList: Product[] = [];
  constructor(private http: HttpClient, private productService: ProductService) { }

  ngOnInit(): void {
    this.productService.getListOfProducts().subscribe(
      (response) => {console.log(response); this.productList = response},
      (error) => {
         // TODO error handling
      }
    );
  }

}
