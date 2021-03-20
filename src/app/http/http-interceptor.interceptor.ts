import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { from, Observable, of } from 'rxjs';
import products from './products.json';
import { Product } from '../products/product';

@Injectable()
export class HttpInterceptorInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<any> {
    if (request.method === 'GET') {
      switch (request.url) {
        case 'api/products':
          if (!localStorage.getItem('productList')) {
            localStorage.setItem('productList', JSON.stringify(this.readProductsFromJson()));
          }
          return from([this.getLocallyStoredProductList()]);
        default:
          return from([]);
      }
    } else if (request.method === 'POST') {
      switch (request.url) {
        case '/api/product/add-product':
          if (!localStorage.getItem('productList')) {
            localStorage.setItem('productList', JSON.stringify(this.readProductsFromJson()));
          }
          if (request.body instanceof Product) {
            this.addNewProduct(request.body);
            return of(this.getLocallyStoredProductList); // Return updated product list
          } else {
            return of({error: 'Invalid parameters provided'});
          }
        default:
          return from([]);
      }
    } else {
      switch (request.url) {
        case '/api/product/delete':
          if (request.body instanceof Product) {
            this.deleteProduct(request.body);
            return of(this.getLocallyStoredProductList); // Return updated product list
          } else {
            return of({error: 'Invalid parameters provided'});
          }
          break;
        default:
          return from([]);
      }
    }
    return next.handle(request);
  }

  getLocallyStoredProductList(): Product[] {
    return JSON.parse(localStorage.getItem('productList'))?.data || [];
  }

  readProductsFromJson(): Product[] {
    return products.data;
  }

  addNewProduct(product: Product) {
    const locallyStoredProductList = this.getLocallyStoredProductList();
    locallyStoredProductList.push(product);
    localStorage.setItem('productList', JSON.stringify(locallyStoredProductList));
  }

  deleteProduct(product: Product) {
    const locallyStoredProductList = this.getLocallyStoredProductList();

    let itemIndex = -1;

    // Ensure all properties in localStorage item match provided body parameters
    locallyStoredProductList.find((listProduct, index) => {
      for (const key in Object.keys(listProduct)) {
        if (listProduct[key] !== product[key]) {
          return false;
        }
      }
      return true;
    });

    if (itemIndex) {
      locallyStoredProductList.splice(0, itemIndex);
    }
    
    localStorage.setItem('productList', JSON.stringify(locallyStoredProductList));
  }
}
