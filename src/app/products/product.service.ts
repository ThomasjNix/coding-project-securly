import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from './product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  addNewProduct(newProduct: Product): Observable<any> {
    return this.http.post('/api/product/add-product', newProduct) as Observable<any>;
  }

  getListOfProducts(): Observable<Product[]> {
    return this.http.get('/api/products') as Observable<Product[]>;
  }

  deleteProducts(products: Product[]): Observable<Product[]> {
    return this.http.post('/api/products/delete', products) as Observable<Product[]>;
  }
}
