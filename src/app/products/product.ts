export class Product {
    fullName: string;
    shortName?: string;
    imageUrl: string;
    price: string;
    postedDate: string;
    position?: number;
    
    constructor(options: {[key:string]: any}) {
        this.fullName = options.fullName;
        this.shortName = options.shortName;
        this.imageUrl = options.imageUrl;
        this.price = options.price;
        this.postedDate = options.postedDate;
        this.position = options.position || 0;
    }
}