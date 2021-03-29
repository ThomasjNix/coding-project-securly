import { ElementRef } from '@angular/core';
import { of } from 'rxjs';
import { ServiceMocks } from '../../service-mocks';
import { Product } from '../product';
import { ProductListComponent } from './product-list.component';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let productServiceMock = ServiceMocks.MockProductService as any;

  beforeEach(async () => {
    component = new ProductListComponent(
      productServiceMock
    );
    component.filterSearch = new ElementRef({value: ''});
    component.shownItems = {
      fullName: true,
      shortName: true,
      imageUrl: true,
      price: true,
      postedDate: true
    };
    component.columnDisplayOrder = [
      { columnName: 'Name', fieldName: 'fullName' },
      { columnName: 'Short Name', fieldName: 'shortName' },
      { columnName: 'Image', fieldName: 'imageUrl' },
      { columnName: 'Price', fieldName: 'price' },
      { columnName: 'Posted Date', fieldName: 'postedDate' }
    ];
  });

  describe('ngOnInit', () => {
    it('Should get the list of products and update the product list and filtered product list', () => {
      jest.spyOn(productServiceMock, 'getListOfProducts').mockReturnValue(of([
        new Product({
          fullName: 'test',
          shortName: 'test',
          imageUrl: 'test',
          price: 'test',
          postedDate: 'test'
        })
      ]));
      const filterRowsSpy = jest.spyOn(component, 'filterRows');
      component.ngOnInit();
      expect(component.productList.length).toEqual(1);
      expect(component.filteredProductList.length).toEqual(1);
      expect(filterRowsSpy).toHaveBeenCalledWith({
        target: {
          value: ''
        }
      })
    });
  });
  describe('deleteItems', () => {
    it('Should delete the provided list of objects and then update the product lists based on the response', () => {
      const filterRowsSpy = jest.spyOn(component, 'filterRows');
      jest.spyOn(productServiceMock, 'deleteProducts').mockReturnValue(of([new Product({
        fullName: 'test',
        shortName: 'test',
        imageUrl: 'test',
        price: 'test',
        postedDate: 'test'
      })]));
      component.deleteItems([]);
      expect(component.productList.length).toEqual(1);
      expect(component.filteredProductList.length).toEqual(1);
      expect(filterRowsSpy).toHaveBeenCalledWith({
        target: {
          value: ''
        }
      });
    });
  });
  describe('showCheckbox', () => {
    it('Should return true if any item is shown', () => {
      expect(component.showCheckbox()).toBeTruthy();
    });
    it('Should return false if all items are not shown', () => {
      for (const property of Object.keys(component.shownItems)) {
        component.shownItems[property] = false;
      }
      expect(component.showCheckbox()).toBeFalsy();
    });
  });
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
