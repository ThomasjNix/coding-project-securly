import { ElementRef } from '@angular/core';
import { of } from 'rxjs';
import { ServiceMocks } from '../../service-mocks';
import { Product } from '../product';
import { ProductListComponent } from './product-list.component';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  const productServiceMock = ServiceMocks.MockProductService as any;

  beforeEach(async () => {
    component = new ProductListComponent(
      productServiceMock
    );
    component.filterSearch = new ElementRef({ value: '' });
    component.selectAllCheckbox = new ElementRef({ value: '' });
    component.filterText = '';
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
      });
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
  describe('toggleRowSelected', () => {
    it('Should remove the row if it is already selected', () => {
      component.selectedRows = [1, 2, 3, 4, 5];
      component.rowCheckboxes = [];
      component.toggleRowSelected(3);
      expect(component.selectedRows).toEqual([1, 2, 4, 5]);
    });
    it('Should add the row if it is not already selected', () => {
      component.selectedRows = [1, 2, 3, 4, 5];
      component.rowCheckboxes = [];
      component.toggleRowSelected(6);
      expect(component.selectedRows).toEqual([1, 2, 3, 4, 5, 6]);
    });
    it('Should check the select all checkbox if all rows are selected', () => {
      component.selectedRows = [1, 2];
      component.rowCheckboxes = ['test1', 'test2', 'test3'] as any;
      component.selectAllCheckbox.nativeElement.checked = false;
      component.toggleRowSelected(3);
      expect(component.selectAllCheckbox.nativeElement.checked).toBeTruthy();
    });
  });
  describe('anyButNotAllRowsSelected', () => {
    beforeEach(() => {
      jest.spyOn(component, 'updateViewCheckboxes').mockImplementation(() => { });
    });
    it('Should return true if any row is selected (but not all)', () => {
      component.selectedRows = [1, 2, 3];
      component.productList = ['test1', 'test2', 'test3', 'test4'] as any;
      expect(component.anyButNotAllRowsSelected()).toBeTruthy();
    });
    it('Should return false if all rows are selected', () => {
      component.selectedRows = [1, 2, 3];
      component.productList = ['test1', 'test2', 'test3'] as any;
      expect(component.anyButNotAllRowsSelected()).toBeFalsy();
    });
    it('Should return false if no rows are selected', () => {
      component.selectedRows = [];
      component.productList = ['test1', 'test2', 'test3', 'test4'] as any;
      expect(component.anyButNotAllRowsSelected()).toBeFalsy();
    });
  });
  describe('toggleAllRows', () => {
    beforeEach(() => {
      jest.spyOn(component, 'updateViewCheckboxes').mockImplementation(() => { });
    });
    it('Should clear the selected rows if all rows are selected', () => {
      component.selectedRows = [1, 2, 3];
      component.productList = ['test1', 'test2', 'test3'] as any;
      component.toggleAllRows();
      expect(component.selectedRows).toEqual([]);
    });
    it('Should mark all rows as selected if not all rows are selected', () => {
      component.selectedRows = [1];
      component.productList = ['test1', 'test2', 'test3'] as any;
      component.toggleAllRows();
      expect(component.selectedRows).toEqual([1, 0, 2]);
    });
    it('Should mark all rows as selected if not all rows are selected (with filter)', () => {
      component.selectedRows = [];
      component.productList = [
        { fullName: 'test1' },
        { fullName: 'test2' },
        { fullName: 'test3' },
      ] as any;
      component.filterText = '2';
      component.toggleAllRows();
      expect(component.selectedRows).toEqual([1]);
    });
  });
  describe('updateViewCheckboxes', () => {
    it('Should mark all selected rows as checked and select all checkbox as checked if all are selected', () => {
      const testCheckboxValues = [
        { nativeElement: { checked: false } },
        { nativeElement: { checked: false } },
        { nativeElement: { checked: false } },
        { nativeElement: { checked: false } },
        { nativeElement: { checked: false } },
      ];
      component.rowCheckboxes = { toArray: () => { } } as any;
      jest.spyOn(component.rowCheckboxes, 'toArray').mockReturnValue(testCheckboxValues);
      component.selectedRows = [0, 1, 2, 3, 4];
      component.updateViewCheckboxes();
      expect(component.selectAllCheckbox.nativeElement.checked).toBeTruthy();
      for (const checkbox of testCheckboxValues) {
        expect(checkbox.nativeElement.checked).toBeTruthy();
      }
    });
  });
  describe('deleteSelectedItems', () => {
    it('Should call deleteItems with all selected items', () => {
      const testCheckboxValues = [
        { nativeElement: { checked: true } },
        { nativeElement: { checked: false } },
        { nativeElement: { checked: true } },
        { nativeElement: { checked: false } },
        { nativeElement: { checked: true } },
      ];
      component.productList = [1, 2, 3, 4, 5] as any;
      component.rowCheckboxes = { toArray: () => { } } as any;
      jest.spyOn(component.rowCheckboxes, 'toArray').mockReturnValue(testCheckboxValues as any);
      const deleteItemsSpy = jest.spyOn(component, 'deleteItems').mockImplementation(() => { });
      component.selectedRows = [0, 2, 4];
      component.deleteSelectedItems();
      expect(deleteItemsSpy).toHaveBeenCalledWith([1, 3, 5] as any);
    });
  });
  describe('filterRows', () => {
    it('Should set the filtered product list to the filtered products based off full name', () => {
      component.productList = [
        { fullName: 'test1' },
        { fullName: 'test2' },
        { fullName: 'test3' },
        { fullName: 'test11' },
        { fullName: 'test15' },
      ] as any;
      component.filterRows({ target: { value: '1' } });
      expect(component.filteredProductList).toEqual([
        { fullName: 'test1' },
        { fullName: 'test11' },
        { fullName: 'test15' }
      ] as any);
    });
  });
  describe('toggleTableOptionsDisplay', () => {
    it('Should toggle the displayTableOptions property', () => {
      component.displayTableOptions = false;
      component.toggleTableOptionsDisplay();
      expect(component.displayTableOptions).toBeTruthy();
    });
  });
  describe('resetColumnOrder', () => {
    it('Should reset the column display oirder and mark all shownItems as true', () => {
      component.shownItems = {
        fullName: false,
        shortName: false,
        imageUrl: false,
        price: false,
        postedDate: false
      };
      component.columnDisplayOrder = [
      ];
      component.resetColumnOrder();
      expect(component.shownItems).toEqual(
        {
          fullName: true,
          shortName: true,
          imageUrl: true,
          price: true,
          postedDate: true
        }
      );
      expect(component.columnDisplayOrder).toEqual(
        [
          { columnName: 'Name', fieldName: 'fullName' },
          { columnName: 'Short Name', fieldName: 'shortName' },
          { columnName: 'Image', fieldName: 'imageUrl' },
          { columnName: 'Price', fieldName: 'price' },
          { columnName: 'Posted Date', fieldName: 'postedDate' }
        ]
      );
    });
  });
  describe('handleDragStart', () => {
    it('Should set the currently dragging element to the events source element', () => {
      component.handleDragStart({ srcElement: 'TEST' });
      expect(component.currentlyDragging).toEqual('TEST');
    });
  });
  // Issue faced with handling global types (DragEvent and TouchEvent) - needs more research
  xdescribe('handleDrag', () => {
    describe('DragEvent', () => {
      it('Should mark non-drop DragEvents as move drop effect', () => {
        const dragEvent = new DragEvent('test');
        dragEvent.dataTransfer.dropEffect = 'none';
        const preventDefaultSpy = jest.spyOn(dragEvent, 'preventDefault');
        component.handleDrag(dragEvent);
        expect(dragEvent.preventDefault).toHaveBeenCalled();
      });
      it('Should update the column display order based off the source and destination of the DragEvent', () => {
        const dragEvent = new DragEvent('test');
        dragEvent.dataTransfer.dropEffect = 'none';
        jest.spyOn(dragEvent, 'type', 'get').mockReturnValue('drop');
        jest.spyOn(component, 'getDraggableDivFromElement').mockReturnValue(null);
        jest.spyOn(component, 'getIndexFromId').mockReturnValue(2);
        component.handleDrag(dragEvent, 0);
        expect(component.columnDisplayOrder).toEqual(
          [
            { columnName: 'Image', fieldName: 'imageUrl' },
            { columnName: 'Name', fieldName: 'fullName' },
            { columnName: 'Short Name', fieldName: 'shortName' },
            { columnName: 'Price', fieldName: 'price' },
            { columnName: 'Posted Date', fieldName: 'postedDate' }
          ]
        );
      });
    });
    describe('TouchEvent', () => {
      it('Should update the column display order based off the source pageX/pageY and destination of the TouchEvent', () => {
        const touchEvent = new TouchEvent('test');
        jest.spyOn(touchEvent, 'type', 'get').mockReturnValue('drop');
        document.elementFromPoint = () => new ElementRef('') as any;
        jest.spyOn(document, 'elementFromPoint').mockReturnValue(null);
        jest.spyOn(component, 'getDraggableDivFromElement').mockImplementation((determinate) => {
          if (determinate === null) {
            return null;
          } else {
            return 'test';
          }
        });
        jest.spyOn(component, 'getIndexFromId').mockImplementation((determinate) => {
          if (determinate === null) {
            return 0;
          } else {
            return 2;
          }
        });

        component.currentlyDragging = 'test';

        component.handleDrag(touchEvent, 0);

        expect(component.columnDisplayOrder).toEqual(
          [
            { columnName: 'Image', fieldName: 'imageUrl' },
            { columnName: 'Name', fieldName: 'fullName' },
            { columnName: 'Short Name', fieldName: 'shortName' },
            { columnName: 'Price', fieldName: 'price' },
            { columnName: 'Posted Date', fieldName: 'postedDate' }
          ]
        );
      });
      it('Should uncheck the box for touch events if the source index is the same as the drop index', () => {
        component.columnDisplayOrder = [
          { columnName: 'Name', fieldName: 'fullName' },
          { columnName: 'Short Name', fieldName: 'shortName' },
          { columnName: 'Image', fieldName: 'imageUrl' },
          { columnName: 'Price', fieldName: 'price' },
          { columnName: 'Posted Date', fieldName: 'postedDate' }
        ];
        jest.spyOn(component, 'getFieldNameFromColName').mockReturnValue('fullName');
        component.columnSelectCheckboxes = {
          toArray: () => [
            { nativeElement: { checked: true } },
            { nativeElement: { checked: true } },
            { nativeElement: { checked: true } },
            { nativeElement: { checked: true } },
            { nativeElement: { checked: true } },
          ]
        } as any;
        const touchEvent = new TouchEvent('test');
        jest.spyOn(touchEvent, 'type', 'get').mockReturnValue('drop');
        document.elementFromPoint = () => new ElementRef('') as any;
        jest.spyOn(document, 'elementFromPoint').mockReturnValue(null);
        jest.spyOn(component, 'getDraggableDivFromElement').mockReturnValue(null);
        jest.spyOn(component, 'getIndexFromId').mockReturnValue(0);
        component.handleDrag(touchEvent, 0);
        expect(component.shownItems.imageUrl).toBeFalsy();
      });
    });
  });
  describe('getFieldNameFromColName', () => {
    it('Should return the fieldName for the provided columnName', () => {
      expect(component.getFieldNameFromColName('Posted Date')).toEqual('postedDate');
    });
  });
  describe('getDraggableDivFromElement', () => {
    it('Should get the parent div of an element if the element is not a div', () => {
      const result = component.getDraggableDivFromElement({
        localName: 'label',
        parentElement: {
          localName: 'div'
        }
      });
      expect(result.localName).toEqual('div');
    });
    it('Should return the element if it is a div', () => {
      const result = component.getDraggableDivFromElement({
        localName: 'div',
        parentElement: {
          localName: 'something else'
        }
      });
      expect(result.localName).toEqual('div');
    });
  });
  describe('getIndexFromId', () => {
    it('Should parse the ID out of a provided ID', () => {
      expect(component.getIndexFromId('some-id-here-5')).toEqual(5);
    });
  });
  describe('checkIfShowPlaceholder', () => {
    it('Should set showPlaceholder to true if there is no filter value', () => {
      component.showPlaceholder = false;
      component.checkIfShowPlaceholder();
      expect(component.showPlaceholder).toBeTruthy();
    });
    it('Should set showPlaceholder to false if there is a filter value', () => {
      component.filterSearch.nativeElement.value = 'test';
      component.showPlaceholder = true;
      component.checkIfShowPlaceholder();
      expect(component.showPlaceholder).toBeFalsy();
    });
  });
});
