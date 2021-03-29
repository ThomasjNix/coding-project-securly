import { Product } from '../product';
import { NewProductComponent } from './new-product.component';
import { ServiceMocks } from '../../service-mocks';

describe('NewProductComponent', () => {
  let component: NewProductComponent;
  let routerMock = ServiceMocks.MockRouter as any;
  let productServiceMock = ServiceMocks.MockProductService as any;

  beforeEach(async () => {
    component = new NewProductComponent(
      routerMock,
      productServiceMock
    );
  });

  describe('ngOnInit', () => {
    it('Should call initializeForm', () => {
      const initializeFormSpy = jest.spyOn(component, 'initializeForm');
      component.ngOnInit();
      expect(initializeFormSpy).toHaveBeenCalled();
    });
  });
  describe('initializeForm', () => {
    it('Should set up the form group', () => {
      component.initializeForm();
      expect(component.addProductForm).toBeDefined();
      expect(component.addProductForm.controls['fullName']).toBeDefined();
    });
  });
  describe('isRequired', () => {
    it('Should return true if the field has a required validator', () => {
  
      component.initializeForm();
      expect(component.isRequired('fullName')).toBeTruthy();
    });
    it('Should return false if the field does not have a required validator', () => {
      component.initializeForm();
      expect(component.isRequired('shortName')).toBeFalsy();
    });
  });
  describe('fieldHasError', () => {
    it('Should return true if the field exists, has the specified errors, and is touched', () => {
      component.initializeForm();
      component.addProductForm.markAllAsTouched();
      component.addProductForm.get('fullName').setValue('');
      expect(component.fieldHasError('fullName', 'required')).toBeTruthy();
    });
    it('Should return false if field does not exist, does not have the specified errors, or is not touched', () => {
      component.initializeForm();
      expect(component.fieldHasError('invalid-name', 'required')).toBeFalsy();
      expect(component.fieldHasError('shortName', 'required')).toBeFalsy();
      expect(component.fieldHasError('fullName', 'required')).toBeFalsy();
    });
  });
  describe('addNewItem', () => {
    it('Should make HTTP call to add the new item if the form is valid', () => {
      const addNewProductSpy = jest.spyOn(productServiceMock, 'addNewProduct');
      const navigateSpy = jest.spyOn(routerMock, 'navigate');
      const testValues = {
        fullName: 'Test full name',
        shortName: 'Test short name',
        imageUrl: 'Test image URL',
        price: '123.45',
        postedDate: '03/29/2021'
      };
      component.initializeForm();
      component.addProductForm.setValue(testValues);
      component.addNewItem();
      expect(addNewProductSpy).toHaveBeenCalledWith(new Product(testValues));
      expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
    });
    it('Should mark the form as touched if the form is invalid', () => {
      component.initializeForm();
      const markAllAsTouchedSpy = jest.spyOn(component.addProductForm, 'markAllAsTouched');
      component.addNewItem();
      expect(markAllAsTouchedSpy).toHaveBeenCalled();
    });
  });
  describe('navigateToList', () => {
    it('Should navigate to the home path', () => {
      const navigateSpy = jest.spyOn(routerMock, 'navigate');
      component.navigateToList();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
    });
  });
});
