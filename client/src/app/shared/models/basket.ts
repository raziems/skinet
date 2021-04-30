import {v4 as uuidv4} from 'uuid';

export interface IBasket {
    id: string;
    items: IBasketItem[];
    clientSecret?:string;
    paymentIntendId?:string;
    deliveryMethodId?:number;
    shippingPrice?: number;
}

export interface IBasketItem {
    id: number;
    productName: string;
    price: number;
    quantity: number;
    pictureUrl: string;
    brand: string;
    type: string;
}

export class Basket implements IBasket{
    id= uuidv4();//'guid';//create unique identifier when create a basket
    items: IBasketItem[]=[];//initialize empty array for new create basket

}

export interface IBasketTotals{
    shipping:number;
    subtotal:number;
    total:number;
}

