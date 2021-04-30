import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Basket, IBasket, IBasketItem, IBasketTotals } from '../shared/models/basket';
import { IDeliveryMethod } from '../shared/models/deliveryMethod';
import { IProduct } from '../shared/models/product';

@Injectable({
  providedIn: 'root'
})

export class BasketService {
  baseUrl=environment.apiUrl;
  private basketSource = new BehaviorSubject<IBasket>(null);
  basket$ = this.basketSource.asObservable();

  private basketTotalSource = new BehaviorSubject<IBasketTotals>(null);
  basketTotal$ = this.basketTotalSource.asObservable();
  shipping=0;

  constructor(private http: HttpClient) { }

  createPaymentIntent() {
    return this.http.post(this.baseUrl + 'payments/' + this.getCurrentBasketValue().id, {})//because is post, need to put {} empty object this.getCurrentBasketValue().id, -->{})
      .pipe(
        map((basket: IBasket) => {
          this.basketSource.next(basket);          
          console.log(this.getCurrentBasketValue());
        })
      )
  }

  setShippingPrice(deliveryMethod: IDeliveryMethod){
    this.shipping=deliveryMethod.price;
    const basket=this.getCurrentBasketValue();
    basket.deliveryMethodId=deliveryMethod.id;
    basket.shippingPrice=deliveryMethod.price;
    this.calculateTotals();
    this.setBasket(basket);
  }

  getBasket(id:string){
    return this.http.get(this.baseUrl +'basket?id='+id)
    .pipe(
      map((basket: IBasket)=> {
        this.basketSource.next(basket);
        //console.log(this.getCurrentBasketValue());
        this.shipping=basket.shippingPrice;//set shipping price before calculate the total. To solve the shipping price <blank> after refresh the page
        this.calculateTotals();
      })
    );
  }

  setBasket(basket:IBasket){
    return this.http.post(this.baseUrl +'basket', basket).subscribe((response: IBasket)=>
    {
      this.basketSource.next(response);
      //console.log(response);
      this.calculateTotals();

    }, error=> {
      console.log(error);
    });
  }

  getCurrentBasketValue(){
    return this.basketSource.value;
  }

  addItemToBasket(item:IProduct, quantity=1){
    const itemToAdd: IBasketItem=this.mapProductItemToBasketItem(item, quantity); //need to map between IProduct and IBasketItem bcoz the property is diff
    const basket = this.getCurrentBasketValue() ?? this.CreateBasket();
    basket.items = this.addOrUpdateItem(basket.items, itemToAdd,quantity);
    this.setBasket(basket);
  }

  incrementItemQuantity(item:IBasketItem){
    const basket=this.getCurrentBasketValue();
    const foundItemIndex=basket.items.findIndex(x=> x.id===item.id);
    basket.items[foundItemIndex].quantity++;
    this.setBasket(basket);
  }

  decrementItemQuantity(item:IBasketItem){
    const basket=this.getCurrentBasketValue();
    const foundItemIndex=basket.items.findIndex(x=> x.id===item.id);
    if(basket.items[foundItemIndex].quantity>1){
      basket.items[foundItemIndex].quantity--;
      this.setBasket(basket);
    }else
    {
      this.removeItemFromBasket(item);
    }
    
  }
  removeItemFromBasket(item: IBasketItem) {
    const basket=this.getCurrentBasketValue();
    if (basket.items.some(x=>x.id===item.id)){//return bool
      basket.items=basket.items.filter(i=> i.id!==item.id); //return array

      if (basket.items.length>0){
        this.setBasket(basket);
      }else{
        this.deleteBasket(basket);
      }
    }
  }

  deleteLocalBasket(id:string)
  {
    this.basketSource.next(null);
    this.basketTotalSource.next(null);
    localStorage.removeItem('basket_id');
  }

  //delete basket using API
  deleteBasket(basket: IBasket) {
    return this.http.delete(this.baseUrl+'basked?id='+ basket.id).subscribe(()=>{
      this.basketSource.next(null);
      this.basketTotalSource.next(null);
      localStorage.removeItem('basket_id');

    },error=>{
      console.log(error);
    })
  }

  private calculateTotals(){
    const basket = this.getCurrentBasketValue();
    const shipping = this.shipping;
    const subtotal=basket.items.reduce((a,b)=> (b.price*b.quantity)+a,0); //a = number, b=item, 0 = initial value for 'a', loop for each item in 'b'
    const total=subtotal+shipping;
    this.basketTotalSource.next({shipping,total, subtotal})
  }

  private addOrUpdateItem(items: IBasketItem[], itemToAdd: IBasketItem, quantity: number): IBasketItem[] {
    console.log(items);
    const index =items.findIndex(i=> i.id===itemToAdd.id); //find the index in the basket, if exist, this is existing item

    if (index=== -1){ //to add existing item in basket
      itemToAdd.quantity=quantity;
      items.push(itemToAdd);

    }else {
      items[index].quantity+=quantity;
    }

    return items;

  }

  private CreateBasket(): IBasket {
    const basket = new Basket(); //create new basket with new id
    console.log("baskerId"+ basket.id)
    localStorage.setItem('basket_id', basket.id); //store basket.id in localstorage. Localstorage specific to the browser. 
    return basket;
  }
  private mapProductItemToBasketItem(item: IProduct, quantity: number): IBasketItem {
  return {
    id:item.id,
    productName: item.name,
    price:item.price,
    pictureUrl: item.pictureUrl,
    quantity,
    brand: item.productBrand,
    type : item.productType
  }
  }
    
}
