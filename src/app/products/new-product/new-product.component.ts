import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from '../product';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.scss']
})
export class NewProductComponent implements OnInit {

  addProductForm: FormGroup;
  constructor(private router: Router, private productService: ProductService) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  /**
   * Sets up the form group on component initialization
   */
  initializeForm(): void {
    this.addProductForm = new FormGroup({
      fullName: new FormControl('', [Validators.required]),
      shortName: new FormControl(''),
      imageUrl: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]*)\?$')]),
      postedDate: new FormControl('', [Validators.required]),
    });
  }

  /**
   * Returns true if the specified field has a required validator
   * @param fieldName
   * @returns
   */
  isRequired(fieldName: string): boolean {
    const fieldValidatorFn = this.addProductForm.get(fieldName).validator;
    if (fieldValidatorFn) {
      return fieldValidatorFn({} as AbstractControl)?.required;
    }
    return false;
  }

  /**
   * Returns true if the specified field has a required error and the field is touched
   * @param fieldName
   * @param errorName
   * @returns
   */
  fieldHasError(fieldName: string, errorName: string): boolean {
    const field = this.addProductForm.get(fieldName);
    return field?.errors && field?.errors[errorName] && field?.touched;
  }

  /**
   * Makes a call to add the new product to the localStorage and navigates to the list page on success
   */
  addNewItem(): void {
    if (this.addProductForm.valid) {
      const newValue = new Product(this.addProductForm.value);
      this.productService.addNewProduct(newValue).subscribe(
        () => { this.router.navigate(['/']); }
      );
    } else {
      // Will show errors for any untouched or invalid fields not already showing errors
      this.addProductForm.markAllAsTouched();
    }
  }

  /**
   * Returns the user to the product list page
   */
  navigateToList(): void {
    this.router.navigate(['/']);
  }

}
