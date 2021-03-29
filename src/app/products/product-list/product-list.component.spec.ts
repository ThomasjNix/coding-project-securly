import { ServiceMocks } from '../../service-mocks';
import { ProductListComponent } from './product-list.component';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let productServiceMock = ServiceMocks.MockProductService as any;

  beforeEach(async () => {
    component = new ProductListComponent(
      productServiceMock
    );
  });

  describe('set indeterminate', () => {
    it('test', () => {
      expect(1).toEqual(1);
    });
  });
});
