import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.scss']
})
export class NewProductComponent implements OnInit {

  addProductForm: FormGroup;
  constructor() { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.addProductForm = new FormGroup({
      'fullName': new FormControl('', [Validators.required]),
      'shortName': new FormControl('', [Validators.required]),
      'imageUrl': new FormControl('', [Validators.required]),
      'price': new FormControl('', [Validators.required]),
      'postedDate': new FormControl('', [Validators.required]),
    });
  }

}
