import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from '../product';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.scss']
})
export class NewProductComponent implements OnInit {

  addProductForm: FormGroup;
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  /**
   * Sets up the form group on component initialization
   */
  initializeForm() {
    this.addProductForm = new FormGroup({
      'fullName': new FormControl('', [Validators.required]),
      'shortName': new FormControl(''),
      'imageUrl': new FormControl('', [Validators.required]),
      'price': new FormControl('', [Validators.required]),
      'postedDate': new FormControl('', [Validators.required]),
    });
  }

  /**
   * Returns true if the specified field has a required validator
   * @param fieldName  
   * @returns 
   */
  isRequired(fieldName: string) {
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
  fieldHasError(fieldName: string, errorName: string) {
    const field = this.addProductForm.get(fieldName);
    return field?.errors?.required && field?.touched;
  }

  addNewItem() {
    if (this.addProductForm.valid) {
      const newValue = new Product(this.addProductForm.value);
      // TODO implement mock API POST
      this.router.navigate(['/']);
    } else {
      // Will show errors for any untouched or invalid fields not already showing errors
      this.addProductForm.markAllAsTouched();
    }
  }

}
