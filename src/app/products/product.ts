export class Product {
    fullName: string;
    shortName?: string;
    imageUrl: string;
    price: string;
    postedDate: string;
    
    constructor(options: {[key:string]: string}) {
        this.fullName = options.fullName;
        this.shortName = options.shortName;
        this.imageUrl = options.imageUrl;
        this.price = options.price;
        this.postedDate = options.postedDate;
    }
}