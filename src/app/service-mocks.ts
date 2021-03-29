import { of } from "rxjs";

export const ServiceMocks = {
    MockRouter: {
        navigate: () => {}
    },
    MockProductService: {
        addNewProduct: () => of({})
    },
    MockElementRef: {},
    MockHttpClient: {
        get: () => of({}),
        post: () => of({})
    }
};;