import { fakeAsync } from '@angular/core/testing';
import { Product } from '../products/product';
import { MockApiInterceptor } from './mock-api-interceptor.interceptor';

describe('MockApiInterceptor', () => {
  let interceptor: MockApiInterceptor;
  beforeEach(() => {
    interceptor = new MockApiInterceptor();
  });

  describe('intercept', () => {
    it('Should call createMockResponse with product list for /api/products', () => {
      const createMockResponseSpy = jest.spyOn(interceptor, 'createMockResponse');
      const getLocallyStoredProductListSpy = jest.spyOn(interceptor, 'getLocallyStoredProductList').mockReturnValue(['test'] as any);
      const mockRequest = {
        method: 'GET',
        url: '/api/products'
      } as any;
      const mockNext = {} as any;
      interceptor.intercept(mockRequest, mockNext);
      expect(createMockResponseSpy).toHaveBeenCalledWith(false, null, ['test']);
    });
    it('Should call createMockResponse with an empty array for all other GET requests', () => {
      const createMockResponseSpy = jest.spyOn(interceptor, 'createMockResponse');
      const mockRequest = {
        method: 'GET',
        url: '/api/other-get-url'
      } as any;
      const mockNext = {} as any;
      interceptor.intercept(mockRequest, mockNext);
      expect(createMockResponseSpy).toHaveBeenCalledWith(false, null, []);
    });
    it('Should call createMockResponse with product list after adding a new product for POST /api/product/add-product', () => {
      const createMockResponseSpy = jest.spyOn(interceptor, 'createMockResponse');
      const addNewProductSpy = jest.spyOn(interceptor, 'addNewProduct').mockImplementation(() => {});
      const getLocallyStoredProductListSpy = jest.spyOn(interceptor, 'getLocallyStoredProductList').mockReturnValue(['test'] as any);
      const mockRequest = {
        method: 'POST',
        url: '/api/product/add-product',
        body: new Product({
          fullName: 'test',
          shortName: 'test',
          imageUrl: 'test',
          price: 'test',
          postedDate: 'test'
        })
      } as any;
      const mockNext = {} as any;
      interceptor.intercept(mockRequest, mockNext);
      expect(addNewProductSpy).toHaveBeenCalledWith(mockRequest.body);
      expect(createMockResponseSpy).toHaveBeenCalledWith(false, null, ['test']);
    });
    it('Should call createMockResponse with error POST /api/product/add-product if body is not a product', () => {
      const createMockResponseSpy = jest.spyOn(interceptor, 'createMockResponse');
      const mockRequest = {
        method: 'POST',
        url: '/api/product/add-product',
        body: null
      } as any;
      const mockNext = {} as any;
      interceptor.intercept(mockRequest, mockNext);
      expect(createMockResponseSpy).toHaveBeenCalledWith(true, 'Invalid parameters provided', null);
    });
    it('Should call createMockResponse with product list after deleting products for POST /api/products/delete', () => {
      const createMockResponseSpy = jest.spyOn(interceptor, 'createMockResponse');
      const deleteProductsSpy = jest.spyOn(interceptor, 'deleteProducts');
      const getLocallyStoredProductListSpy = jest.spyOn(interceptor, 'getLocallyStoredProductList').mockReturnValue(['test'] as any);
      const mockRequest = {
        method: 'POST',
        url: '/api/products/delete',
        body: [new Product({
          fullName: 'test',
          shortName: 'test',
          imageUrl: 'test',
          price: 'test',
          postedDate: 'test'
        })] as Product[]
      } as any;
      const mockNext = {} as any;
      interceptor.intercept(mockRequest, mockNext);
      expect(deleteProductsSpy).toHaveBeenCalledWith(mockRequest.body);
      expect(createMockResponseSpy).toHaveBeenCalledWith(false, null, ['test']);
    });
    it('Should call createMockResponse with error POST /api/products/delete if body is not an Array', () => {
      const createMockResponseSpy = jest.spyOn(interceptor, 'createMockResponse');
      const mockRequest = {
        method: 'POST',
        url: '/api/products/delete',
        body: null
      } as any;
      const mockNext = {} as any;
      interceptor.intercept(mockRequest, mockNext);
      expect(createMockResponseSpy).toHaveBeenCalledWith(true, 'Invalid list of products provided', null);
    });
  });
  describe('getLocallyStoredProductList', () => {
    it('Should set product list in local storage from JSON file and return it', () => {
      const readProductsFromJsonSpy = jest.spyOn(interceptor, 'readProductsFromJson').mockReturnValue([{'TEST-KEY': 'TEST-VALUE'}] as any);
      localStorage.removeItem('productList');
      const result = interceptor.getLocallyStoredProductList();
      expect(result).toEqual([{'TEST-KEY': 'TEST-VALUE'}] as any);
      expect(localStorage.getItem('productList')).toBeDefined();
    });
  });
  describe('addNewProduct', () => {
    it('Should add the provided Product to the list in local storage', () => {
      localStorage.setItem('productList',
        JSON.stringify([new Product({
          fullName: 'test',
          shortName: 'test',
          imageUrl: 'test',
          price: 'test',
          postedDate: 'test'
        })])
      );
      interceptor.addNewProduct(new Product({
        fullName: 'test2',
        shortName: 'test2',
        imageUrl: 'test2',
        price: 'test2',
        postedDate: 'test2'
      }));
      expect(JSON.parse(localStorage.getItem('productList'))[1]).toBeDefined();
    });
  });
  describe('deleteProducts', () => {
    it('Should remove the specified product from the product list in local storage', () => {
      const getLocallyStoredProductListSpy = jest.spyOn(interceptor, 'getLocallyStoredProductList').mockReturnValue([
        new Product({
          fullName: 'test',
          shortName: 'test',
          imageUrl: 'test',
          price: 'test',
          postedDate: 'test'
        }),
        new Product({
          fullName: 'test2',
          shortName: 'test2',
          imageUrl: 'test2',
          price: 'test2',
          postedDate: 'test2'
        })
      ]);
      interceptor.deleteProducts(
        [new Product({
          fullName: 'test',
          shortName: 'test',
          imageUrl: 'test',
          price: 'test',
          postedDate: 'test'
        })]
      );
      expect(JSON.parse(localStorage.getItem('productList')).length).toEqual(1);
    });
  });
  describe('createMockResponse', () => {
    it('Should return an HttpResponse with the error if one is provided', fakeAsync(() => {
      interceptor.createMockResponse(true, 'this is an error', null).subscribe((response) => {
        expect(response.status).toEqual(500);
        expect(response.body).toEqual({error: 'this is an error'});
      });
    }));
    it('Should return an HttpResponse with a 200 status and the body if there are no errors', () => {
      interceptor.createMockResponse(false, null, []).subscribe((response) => {
        expect(response.status).toEqual(200);
        expect(response.body).toEqual([]);
      });
    });
  });
});
