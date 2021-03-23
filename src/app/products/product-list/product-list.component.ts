import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { MatTableDataSource }  from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  selection = new SelectionModel<Product>(true, []);
  productList: Product[] = [];
  dataSource: MatTableDataSource<Product>;
  shownItems = [
    'select',
    'fullName',
    'shortName',
    'imageUrl',
    'price',
    'postedDate'
  ];
  constructor(private http: HttpClient, private productService: ProductService, private cdRef: ChangeDetectorRef, private router: Router) { }

  ngOnInit(): void {
    this.productService.getListOfProducts().subscribe(
      (response) => {this.productList = response; this.dataSource = new MatTableDataSource(this.productList)},
      (error) => {
         // TODO error handling
      }
    );
  }

  deleteDisabled(): boolean {
    return this.selection.isEmpty();
  }

  deleteItems(): void {
    const selectedProducts = this.productList.filter((product) => {
      const index = this.selection.selected.indexOf(product);
      return this.selection.selected.indexOf(product) > -1;
    });
    this.productService.deleteProducts(selectedProducts).subscribe(
      (response: Product[]) => this.handleDeleteResponse(response, selectedProducts),
      (error: HttpErrorResponse) => {
        // TODO error handling
      }
    );
  }

  handleDeleteResponse(response: Product[], selectedProducts: Product[]) {
    this.productList = response;
    this.dataSource = new MatTableDataSource(response);
    for (const product of selectedProducts) {
      this.selection.deselect(product);
    }
    this.cdRef.detectChanges();
  }

  toggleDisplay(column: string): void {
    const columnIndex = this.shownItems.indexOf(column);
    if (columnIndex === -1) {
      this.shownItems.push(column);
    } else {
      this.shownItems.splice(columnIndex, 1);
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.productList.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.productList.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Product): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  goToAddProduct(): void {
    this.router.navigate(['/add-product']);
  }

}
