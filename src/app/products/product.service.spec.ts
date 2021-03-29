import { ServiceMocks } from '../service-mocks';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock = ServiceMocks.MockHttpClient as any;

  beforeEach(() => {
    service = new ProductService(httpMock);
  });

  describe('addNewProduct', () => {});
  describe('getListOfProducts', () => {});
  describe('deleteProducts', () => {});
});
