import { Component, ElementRef, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { faCog, faBars, faTrash, faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';
import { ColumnProperties } from './column-properties';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  // FontAwesome icon imports
  faCog = faCog;
  faBars = faBars;
  faTrash = faTrash;
  faSearch = faSearch;
  faPlus = faPlus;

  // View refrences
  @ViewChildren('rowCheckboxes') rowCheckboxes;
  @ViewChildren('columnSelectCheckboxes') columnSelectCheckboxes;
  @ViewChild('selectAllCheckbox') selectAllCheckbox: ElementRef;
  @ViewChild('filterSearch') filterSearch: ElementRef;

  // Table / Meta data properties
  displayTableOptions = false;
  filterText = '';
  productList: Product[] = [];
  filteredProductList: Product[] = [];
  selectedRows: number[] = [];
  currentlyDragging: any;
  showPlaceholder = true;
  shownItems = {
    fullName: true,
    shortName: true,
    imageUrl: true,
    price: true,
    postedDate: true
  };
  columnDisplayOrder: ColumnProperties[] = [
    { columnName: 'Name', fieldName: 'fullName' },
    { columnName: 'Short Name', fieldName: 'shortName' },
    { columnName: 'Image', fieldName: 'imageUrl' },
    { columnName: 'Price', fieldName: 'price' },
    { columnName: 'Posted Date', fieldName: 'postedDate' }
  ];

  constructor(private productService: ProductService) { }

  /**
   * Initializes the list
   * Get data from the mock API and construct a list of products.
   * If filter text is set, maintain filtering
   */
  ngOnInit(): void {
    this.productService.getListOfProducts().subscribe(
      (response) => {
        for (const product of response) {
          this.productList.push(new Product(product));
        }
        this.filteredProductList = this.productList;
        this.filterRows({ target: { value: this.filterSearch?.nativeElement?.value || '' } });
      }
    );
  }

  /**
   * Receives a list of products and makes the API call to delete them from localStorage
   * Updates the product list and filtered list when the call is complete using the filter input value
   * @param products
   */
  deleteItems(products: Product[]): void {
    this.productService.deleteProducts(products).subscribe(
      (response: Product[]) => {
        this.productList = response;
        this.filteredProductList = this.productList;
        this.filterRows({ target: { value: this.filterSearch?.nativeElement?.value || '' } });
      }
    );
  }

  /**
   * Determines if the checkbox column should be shown based off if any rows are present in the table
   * No rows = nothing to select = no checkbox column
   * @returns
   */
  showCheckbox(): boolean {
    for (const property of Object.keys(this.shownItems)) {
      if (this.shownItems[property]) {
        return true;
      }
    }
    return false;
  }

  /**
   * Adds or removes the selected row from the list of selected rows depending on if it is currently checked or unchecked
   * If all rows are checked, check the select all checkbox
   * If no rows are selected, uncheck the select all checkbox
   * @param index
   */
  toggleRowSelected(index: number): void {
    const rowIndex = this.selectedRows.indexOf(index);
    if (rowIndex > -1) {
      this.selectedRows.splice(rowIndex, 1);
    } else {
      this.selectedRows.push(index);
    }
    if (this.selectedRows.length === this.rowCheckboxes.length) {
      this.selectAllCheckbox.nativeElement.checked = true;
    } else if (this.selectedRows.length === 0) {
      this.selectAllCheckbox.nativeElement.checked = false;
    }
  }

  /**
   * Returns true if any row is selected, but not all rows are selected (for indeterminate state of the select all checkbox)
   * @returns
   */
  anyButNotAllRowsSelected(): boolean {
    return this.selectedRows.length > 0 && this.selectedRows.length !== this.productList.length;
  }

  /**
   * Fires when the select all checkbox is clicked.
   * If currently checked, deselects all rows.
   * Else, adds all rows not currently selected to the selected rows array
   *
   * If filter text is set, only adds rows that match the filter text by fullName to the array (used for filtered selection)
   */
  toggleAllRows(): void {
    if (this.selectedRows.length === this.productList.length) {
      this.selectedRows = [];
    } else {
      for (let i = 0; i < this.productList.length; i++) {
        if (this.selectedRows.indexOf(i) === -1) {
          if (!this.filterText ||
            (this.filterText && this.productList[i].fullName.toLowerCase().indexOf(this.filterText.toLowerCase()) > -1)) {
            this.selectedRows.push(i);
          }
        }
      }
    }
    this.updateViewCheckboxes();
  }

  /**
   * Updates every rows checkbox to checked if the row is in the list of selected rows, else marks as unchecked
   * If the selected rows length is that of the checkboxes array (e.g. all rows are selected), mark the select all checkbox as checked
   */
  updateViewCheckboxes(): void {
    const checkboxesArray = this.rowCheckboxes.toArray();
    for (let i = 0; i < checkboxesArray.length; i++) {
      checkboxesArray[i].nativeElement.checked = (this.selectedRows.indexOf(i) > -1);
    }
    if (checkboxesArray.length === this.selectedRows.length) {
      this.selectAllCheckbox.nativeElement.checked = true;
    }
  }

  /**
   * Iterates over the list of selected rows and unchecks the selected checkboxes
   * Then empties the selected rows array and makes the call to delete the previously selected items
   */
  deleteSelectedItems(): void {
    const checkboxesArray = this.rowCheckboxes.toArray();
    const toDeleteProducts = [];
    for (const index of this.selectedRows) {
      checkboxesArray[index].nativeElement.checked = false;
      toDeleteProducts.push(this.productList[index]);
    }
    this.selectedRows = [];
    this.deleteItems(toDeleteProducts);
  }

  /**
   * Uses the value of the filter input to filter the product list
   * Assigns the filtered value to the filteredProductList so that the original product list remains the same
   * filteredProductList is used for view operations, and when no filter is applied it is equivalent to the original productList
   * @param event
   */
  filterRows(event: any): void {
    const filterValue = event.target.value.toString();
    if (!filterValue) {
      this.filteredProductList = this.productList;
    } else {
      this.filteredProductList = this.productList.filter((product) => {
        return product.fullName.toLowerCase().indexOf(filterValue.toLowerCase()) > -1;
      });
    }
  }

  /**
   * Toggles whether or not to show the table settings (such as which columns to display and column order)
   */
  toggleTableOptionsDisplay(): void {
    this.displayTableOptions = !this.displayTableOptions;
  }

  /**
   * Resets the table settings to display all columns in the original order
   */
  resetColumnOrder(): void {
    this.columnDisplayOrder = [
      { columnName: 'Name', fieldName: 'fullName' },
      { columnName: 'Short Name', fieldName: 'shortName' },
      { columnName: 'Image', fieldName: 'imageUrl' },
      { columnName: 'Price', fieldName: 'price' },
      { columnName: 'Posted Date', fieldName: 'postedDate' }
    ];
    for (const key of Object.keys(this.shownItems)) {
      this.shownItems[key] = true;
    }
  }

  /**
   * Assigns the element on dragStart event to a variable for access when drag ends
   * @param event
   */
  handleDragStart(event: any): void {
    this.currentlyDragging = event.srcElement;
  }

  /**
   * the main method for handling drag and drop on both desktop (DragEvent) and mobile (TouchEvent)
   *
   * For desktop the source element is obtained from the previously called handleDragStart(), and on the drop event a
   * drop index is provided of the landing element. This is used to update the order of the columns.
   *
   * For mobile first check that the original element and landing element are not the same via document.elementFromPoint()
   * and the changedTouches value.
   *
   * If the starting and ending element are the same, apply checkbox check/uncheck behavior (avoids drag and drop for simple clicks/touches)
   * If they are not the same, apply the same column reordering logic used for DragEvent
   * @param event
   * @param dropIndex
   * @returns
   */
  handleDrag(event: any, dropIndex?: number): boolean {
    event.preventDefault();
    if (event instanceof DragEvent) {
      event.dataTransfer.dropEffect = 'move';
    }

    if ((event.type === 'drop' || event.type === 'touchend') && dropIndex > -1) {
      if (window.TouchEvent && event instanceof TouchEvent) {
        const landingElement = this.getDraggableDivFromElement(document.elementFromPoint(
          event.changedTouches[0].pageX,
          event.changedTouches[0].pageY
        ));
        dropIndex = this.getIndexFromId(landingElement.id);
      }

      const sourceElement = this.getDraggableDivFromElement(this.currentlyDragging);
      const sourceIndex = this.getIndexFromId(sourceElement.id);
      if (window.TouchEvent && event instanceof TouchEvent && dropIndex === sourceIndex) {
        const fieldName = this.getFieldNameFromColName(sourceElement.innerText);
        this.shownItems[fieldName] = !this.shownItems[fieldName];
        const relativeCheckbox = this.columnSelectCheckboxes.toArray()[sourceIndex];
        relativeCheckbox.nativeElement.checked = !relativeCheckbox.nativeElement.checked;
      } else {
        const sourceColumn = this.columnDisplayOrder.splice(sourceIndex, 1)[0];
        this.columnDisplayOrder.splice(dropIndex, 0, sourceColumn);
      }
    }
    return false;
  }


  /**
   * Returns the field name of the column with the matching (provided) column name
   * @param name
   * @returns
   */
  getFieldNameFromColName(name: string): string {
    return this.columnDisplayOrder.find((col) => col.columnName === name).fieldName;
  }

  /**
   * Returns the parent div of an element provided if that element is not already a div
   * Used to handle drag/drop events that target label or input rather than div
   * @param element
   * @returns
   */
  getDraggableDivFromElement(element: any): any {
    if (element.localName !== 'div') {
      element = element.parentElement;
    }
    return element;
  }

  /**
   * Retrieves the number parsed index from a provided ID
   * ex: 'column-index-3' -> 3
   * @param id
   * @returns
   */
  getIndexFromId(id: string): number {
    return parseInt(id.substring(id.lastIndexOf('-') + 1, id.length), 10);
  }

  /**
   * Converts a dateString to a Date object and returns it
   * @param dateString
   * @returns
   */
  formatDate(dateString: string): Date {
    return new Date(dateString);
  }

  checkIfShowPlaceholder(): void {
    if (this.filterSearch.nativeElement.value === '') {
      this.showPlaceholder = true;
    } else {
      this.showPlaceholder = false;
    }
  }
}
