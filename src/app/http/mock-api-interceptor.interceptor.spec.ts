import { MockApiInterceptor } from './mock-api-interceptor.interceptor';

describe('MockApiInterceptor', () => {
  let interceptor: MockApiInterceptor;
  beforeEach(() => {
    interceptor = new MockApiInterceptor();
  });

  describe('intercept', () => {
    it('test', () => {
      expect(1).toEqual(1);
    });
  });
  describe('getLocallyStoredProductList', () => {});
  describe('readProductsFromJson', () => {});
  describe('addNewProduct', () => {});
  describe('deleteProducts', () => {});
  describe('createMockResponse', () => {});
});
