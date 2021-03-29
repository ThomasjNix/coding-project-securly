import { of } from "rxjs";

export const ServiceMocks = {
    MockRouter: {
        navigate: () => {}
    },
    MockProductService: {
        addNewProduct: () => of({})
    }
};;