import { of } from 'rxjs';

export const ServiceMocks = {
    MockRouter: {
        navigate: () => {}
    },
    MockProductService: {
        addNewProduct: () => of({}),
        getListOfProducts: () => of([]),
        deleteProducts: () => of([])
    },
    MockElementRef: {
        nativeElement: {
            indeterminate: false
        }
    },
    MockHttpClient: {
        get: () => of({}),
        post: () => of({})
    }
};
