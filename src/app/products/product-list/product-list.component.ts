import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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
  shownItems = {
    fullName: true,
    shortName: true,
    imageUrl: true,
    price: true,
    postedDate: true
  };
  constructor(private http: HttpClient, private productService: ProductService) { }

  ngOnInit(): void {
    this.productService.getListOfProducts().subscribe(
      (response) => {this.productList = response},
      (error) => {
         // TODO error handling
      }
    );
  }

  deleteItems(products: Product[]) {
    this.productService.deleteProducts(products).subscribe(
      (response: Product[]) => {this.productList = response},
      (error: HttpErrorResponse) => {
        // TODO error handling
      }
    );
  }

}
