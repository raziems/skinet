import { Component, OnInit } from '@angular/core';
import { AccountService } from './account/account.service';
import { BasketService } from './basket/basket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'Skinet';
  

  constructor(private basketService: BasketService, private accountService:AccountService) {

  }

  ngOnInit(): void {
    // this.http.get('https://localhost:5001/api/products?pageSize=50').subscribe(      
    // (response: IPagination) => {
    //   //console.log(response);
    //   this.products=response.data;
    // }, error => {
    //   console.log(error);
    // }); //get data from API

    
    this.loadBasket();
    this.loadCurrentUser();

  }

  loadCurrentUser()
  {
    const token = localStorage.getItem('token');
    
    
      this.accountService.loadCurrentUser(token).subscribe(()=>{
        console.log('loaded user');        
      }, error=>{
        console.log(error)        
      });
    
  }

  loadBasket()
  {
    const baskerId=localStorage.getItem('basket_id');//get the basket_id from localstorage if available
    if (baskerId){
      this.basketService.getBasket(baskerId).subscribe(()=>{
        console.log('initialised basket');
      }, error=>{
        console.log(error);
      })
    }
  }

}
