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
    return <Observable<any>>this.http.post('/api/product/add-product', newProduct);
  }

  getListOfProducts(): Observable<Product[]> {
    return <Observable<Product[]>>this.http.get('/api/products');
  }

  deleteProducts(products: Product[]): Observable<Product[]> {
    return <Observable<Product[]>>this.http.post('/api/products/delete', products);
  }
}
