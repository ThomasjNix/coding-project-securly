import { ServiceMocks } from '../service-mocks';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock = ServiceMocks.MockHttpClient as any;

  beforeEach(() => {
    service = new ProductService(httpMock);
  });

  describe('addNewProduct', () => {
    it('test', () => {
      expect(1).toEqual(1);
    });
  });
  describe('getListOfProducts', () => {});
  describe('deleteProducts', () => {});
});
