import { IndeterminateDirective } from './indeterminate.directive';
import { ServiceMocks } from '../../service-mocks';

describe('ProductListComponent', () => {
  let directive: IndeterminateDirective;
  let elementRefMock = ServiceMocks.MockElementRef as any;

  beforeEach(async () => {
    directive = new IndeterminateDirective(
      elementRefMock
    );
  });

  describe('ngOnInit', () => {});
  describe('deleteItems', () => {});
  describe('showCheckbox', () => {});
  describe('toggleRowSelected', () => {});
  describe('anyButNotAllRowsSelected', () => {});
  describe('toggleAllRows', () => {});
  describe('updateViewCheckboxes', () => {});
  describe('deleteSelectedItems', () => {});
  describe('filterRows', () => {});
  describe('toggleTableOptionsDisplay', () => {});
  describe('resetColumnOrder', () => {});
  describe('handleDragStart', () => {});
  describe('handleDrag', () => {});
  describe('getFieldNameFromColName', () => {});
  describe('getDraggableDivFromElement', () => {});
  describe('getIndexFromId', () => {});
  describe('formatDate', () => {});
  describe('checkIfShowPlaceholder', () => {});
});
