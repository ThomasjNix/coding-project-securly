import { ServiceMocks } from '../service-mocks';
import { Product } from './product';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock = ServiceMocks.MockHttpClient as any;

  beforeEach(() => {
    service = new ProductService(httpMock);
  });

  describe('addNewProduct', () => {
    it('Should make HTTP POST call to add the new product', () => {
      const postSpy = jest.spyOn(httpMock, 'post');
      const testProduct = new Product({
        fullName: 'test',
        shortName: 'test',
        imageUrl: 'test',
        price: 'test',
        postedDate: 'test'
      });
      service.addNewProduct(testProduct);
      expect(postSpy).toHaveBeenCalledWith('/api/product/add-product', testProduct);
    });
  });
  describe('getListOfProducts', () => {
    it('Should make HTTP GET call to retrieve list of products', () => {
      const getSpy = jest.spyOn(httpMock, 'get');
      service.getListOfProducts();
      expect(getSpy).toHaveBeenCalledWith('/api/products');
    });
  });
  describe('deleteProducts', () => {
    it('Should make HTTP POST call to delete a product list', () => {
      const postSpy = jest.spyOn(httpMock, 'post');
      const testProduct1 = new Product({
        fullName: 'test',
        shortName: 'test',
        imageUrl: 'test',
        price: 'test',
        postedDate: 'test'
      });
      const testProduct2 = new Product({
        fullName: 'test2',
        shortName: 'test2',
        imageUrl: 'test2',
        price: 'test2',
        postedDate: 'test2'
      });
      service.deleteProducts([testProduct1, testProduct2]);
      expect(postSpy).toHaveBeenCalledWith('/api/products/delete', [testProduct1, testProduct2]);
    });
  });
});
