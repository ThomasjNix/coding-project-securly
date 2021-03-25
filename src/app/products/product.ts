export class Product {
    fullName: string;
    shortName?: string;
    imageUrl: string;
    price: string;
    postedDate: string;

    constructor(options: { [key: string]: any} ) {
        this.fullName = options.fullName;
        this.shortName = options.shortName;
        this.imageUrl = options.imageUrl;
        this.price = options.price;
        if (this.price.indexOf('.') === this.price.length - 1) {
            this.price = this.price.replace('.', '');
        }
        if (this.price.indexOf('$') === -1) {
            this.price = '$' + this.price;
        }
        this.postedDate = options.postedDate;
    }
}
