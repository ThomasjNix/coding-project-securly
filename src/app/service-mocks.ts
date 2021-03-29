import { of } from "rxjs";

export const ServiceMocks = {
    MockRouter: {
        navigate: () => {}
    },
    MockProductService: {
        addNewProduct: () => of({})
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
};;