import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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
  faCog = faCog;
  faBars = faBars;
  faTrash = faTrash;
  faSearch = faSearch;
  faPlus = faPlus;
  @ViewChildren('rowCheckboxes') rowCheckboxes;
  @ViewChild('selectAllCheckbox') selectAllCheckbox: ElementRef;
  @ViewChild('filterSearch') filterSearch: ElementRef;
  displayTableOptions = false;
  productList: Product[] = [];
  filteredProductList: Product[] = [];
  shownItems = {
    fullName: true,
    shortName: true,
    imageUrl: true,
    price: true,
    postedDate: true
  };
  selectedRows: number[] = [];
  filterText: string = '';
  columnDisplayOrder: ColumnProperties[] = [
    {columnName: 'Name', fieldName: 'fullName'},
    {columnName: 'Short Name', fieldName: 'shortName'},
    {columnName: 'Image', fieldName: 'imageUrl'},
    {columnName: 'Price', fieldName: 'price'},
    {columnName: 'Posted Date', fieldName: 'postedDate'}
  ];
  currentlyDragging: any;

  constructor(private http: HttpClient, private productService: ProductService) { }

  ngOnInit(): void {
    this.productService.getListOfProducts().subscribe(
      (response) => {
        for (const product of response) {
          this.productList.push(new Product(product));
        }
        this.filteredProductList = this.productList;
        this.filterRows({target: {value: this.filterSearch?.nativeElement?.value || ''}})
      },
      (error) => {
         // TODO error handling
      }
    );
  }

  deleteItems(products: Product[]) {
    this.productService.deleteProducts(products).subscribe(
      (response: Product[]) => {
        this.productList = response;
         this.filteredProductList = this.productList;
         this.filterRows({target: {value: this.filterSearch?.nativeElement?.value || ''}})
      },
      (error: HttpErrorResponse) => {
        // TODO error handling
      }
    );
  }

  showCheckbox(): boolean {
    for (const property of Object.keys(this.shownItems)) {
      if (this.shownItems[property]) {
        return true;
      }
    }
    return false;
  }

  toggleRowSelected(index: number) {
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

  anyRowSelected(): boolean {
    return this.selectedRows.length > 0 && this.selectedRows.length !== this.productList.length;
  }

  toggleAllRows(): void {
    if (this.selectedRows.length === this.productList.length) {
      this.selectedRows = [];
    } else {
      for (let i = 0; i < this.productList.length; i++) {
        if (this.selectedRows.indexOf(i) === -1) {
          if (!this.filterText || (this.filterText && this.productList[i].fullName.toLowerCase().indexOf(this.filterText.toLowerCase()) > -1)) {
            this.selectedRows.push(i);
          }
        }
      }
    }
    this.updateViewCheckboxes();
  }

  updateViewCheckboxes(): void {
    const checkboxesArray = this.rowCheckboxes.toArray();
    for (let i = 0; i < checkboxesArray.length; i++) {
      checkboxesArray[i].nativeElement.checked = (this.selectedRows.indexOf(i) > -1);
    }
    if (checkboxesArray.length === this.selectedRows.length) {
      this.selectAllCheckbox.nativeElement.checked = true;
    }
  }

  deleteSelectedItems() {
    const checkboxesArray = this.rowCheckboxes.toArray();
    const toDeleteProducts = [];
    for (const index of this.selectedRows) {
      checkboxesArray[index].nativeElement.checked = false;
      toDeleteProducts.push(this.productList[index]);
    }
    this.selectedRows = [];
    this.deleteItems(toDeleteProducts);
    this.selectAllCheckbox.nativeElement.checked = this.selectedRows.length > 0;
  }

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

  toggleTableOptionsDisplay(): void  {
    this.displayTableOptions = !this.displayTableOptions;
  }

  resetColumnOrder(): void {
    this.columnDisplayOrder = [
      {columnName: 'Full Name', fieldName: 'fullName'},
      {columnName: 'Short Name', fieldName: 'shortName'},
      {columnName: 'Image URL', fieldName: 'imageUrl'},
      {columnName: 'Price', fieldName: 'price'},
      {columnName: 'Posted Date', fieldName: 'postedDate'}
    ];
    for (const key of Object.keys(this.shownItems)) {
      this.shownItems[key] = true;
    }
  }

  handleDragStart(event: any) {
    this.currentlyDragging = event.srcElement;
  }

  handleDrag(event: any, dropIndex?: number) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    if (event.type === 'drop' && dropIndex > -1) {
      let sourceElement = this.currentlyDragging;
      if (sourceElement.localName === 'label') {
        sourceElement = sourceElement.parentElement;
      }
      let sourceIndex = sourceElement.id.substring(sourceElement.id.lastIndexOf('-') + 1, sourceElement.id.length);
      const sourceColumn = this.columnDisplayOrder.splice(sourceIndex, 1)[0];
      this.columnDisplayOrder.splice(dropIndex, 0, sourceColumn);
    }
    return false;
  }

  formatDate(dateString: string) {
    return new Date(dateString);
  }
}
