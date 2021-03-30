import { IndeterminateDirective } from './indeterminate.directive';
import { ServiceMocks } from '../../service-mocks';

describe('ProductListComponent', () => {
  let directive: IndeterminateDirective;
  const elementRefMock = ServiceMocks.MockElementRef as any;

  beforeEach(async () => {
    directive = new IndeterminateDirective(
      elementRefMock
    );
  });

  test.skip('Nothing to test', () => 1);
});
