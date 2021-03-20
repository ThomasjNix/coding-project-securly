import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { from, Observable, of } from 'rxjs';
import products from './products.json';
import { Product } from '../products/product';

@Injectable()
export class MockApiInterceptor implements HttpInterceptor {

  constructor() {}

  /**
   * Intercept HTTP requests
   * Gathers data from the products.json file if no localStorage productList is found, and sets the values in local storage
   * GET requests return the localStorage productList
   * POST requests update the productList in localStorage with the request body, then return the updated productList
   * DELETE requests splice the index of the request body from the productList and then return it
   * @param request 
   * @param next 
   * @returns 
   */
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<any> {
    let hasError = false;
    let error = null;;
    let body = null;
    if (request.method === 'GET') {
      switch (request.url) {
        case '/api/products':
          body = this.getLocallyStoredProductList();
          break;
        default:
          body = [];
      }
    } else if (request.method === 'POST') {
      switch (request.url) {
        case '/api/product/add-product':
          if (request.body instanceof Product) {
            this.addNewProduct(request.body);
            body = this.getLocallyStoredProductList
          } else {
            hasError = true;
            error = 'Invalid parameters provided';
          }
          break;
        default:
          body = [];
      }
    } else {
      switch (request.url) {
        case '/api/product/delete':
          if (request.body instanceof Product) {
            if (this.deleteProduct(request.body)) {
              body = this.getLocallyStoredProductList
            } else {
              hasError = true;
              error = 'Product not found';
            }
          } else {
            hasError = true;
            error = 'Product not found';
          }
          break;
        default:
          body = [];
      }
    }

    return this.createMockResponse(hasError, error, body);
  }

  /**
   * Returns the parsed product list from localStorage
   * If none is available, first set it from the products.json file and then return the parsed list from localStorage
   * @returns 
   */
  getLocallyStoredProductList(): Product[] {
    if (!localStorage.getItem('productList')) {
      localStorage.setItem('productList', JSON.stringify(this.readProductsFromJson()));
    }
    return JSON.parse(localStorage.getItem('productList')) || [];
  }

  /**
   * Returns the list of data from products.json
   * @returns 
   */
  readProductsFromJson(): Product[] {
    return products.data;
  }

  /**
   * Gets the list of products from localStorage and adds the provided new Product to the list
   * Then sets the stringified list to localStorage
   * @param product 
   */
  addNewProduct(product: Product) {
    const locallyStoredProductList = this.getLocallyStoredProductList();
    locallyStoredProductList.push(product);
    localStorage.setItem('productList', JSON.stringify(locallyStoredProductList));
  }

  /**
   * Gets the product list from localStorage and finds the index of the provided Product
   * If one is found, splice it from the list and then set the stringified list in localStorage then return true (success)
   * Else return false (failure - item not found)
   * @param product 
   */
  deleteProduct(product: Product): boolean {
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
      localStorage.setItem('productList', JSON.stringify(locallyStoredProductList));
      return true;
    }
    return false;
  }

  /**
   * Generates a mock response based off the values configured in the interceptor
   * @param hasError 
   * @param error 
   * @param body 
   */
  createMockResponse(hasError: boolean, error: string | null, body: Product[] | null): Observable<HttpResponse<any>> {
    if (hasError) {
      return of(new HttpResponse({status: 500, body: {error}}));
    } else {
      return of(new HttpResponse({status: 200, body: body}));
    }
  }
}
