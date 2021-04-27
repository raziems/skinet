import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IBrand } from '../shared/models/brand';
import { IProduct } from '../shared/models/product';
import { IType } from '../shared/models/productType';
import { ShopParams } from '../shared/models/shopParams';
import { ShopService } from './shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  @ViewChild('search', {static:false}) searchTerm:ElementRef;//for angular 9, static default value set to false, for angular 8 and below, need to specify, true indicate the search element not relaying on any activity
  products: IProduct[]; //from models
  brands:IBrand[];
  types : IType[];
  shopParams= new ShopParams();
  totalCount:number;
  sortOptions = [
    {name: 'Alphabetical', value: 'name'},
    {name: 'Price: Low to high', value: 'priceAsc'},
    {name: 'Price: High to low', value: 'priceDesc'},
  ]

  //inject ShopService into constructor
  constructor(private shopService:ShopService) { }

  ngOnInit(): void {
    this.getProducts();
    this.getBrands();
    this.getTypes();
  }

  getProducts() {
    this.shopService.getProducts(this.shopParams).subscribe(response => {
      this.products = response.data;
      this.shopParams.pageNumber = response.pageIndex;
      this.shopParams.pageSize = response.pageSize;
      this.totalCount = response.count;
    }, error => {
      console.log(error);
    })
  }

  getBrands()
  {
    this.shopService.getBrands().subscribe(response => {
      this.brands = [{id: 0, name: 'All'}, ...response]; //response; //add All to the list
    }, error => {
      console.log(error);
    });
  }

  getTypes()
  {
    this.shopService.getTypes().subscribe(response => {
      this.types = [{id: 0, name: 'All'}, ...response];
    }, error => {
      console.log(error);
    });
  }

  onBrandSelected (brandId:number)
  {
    this.shopParams.brandId=brandId;
    this.shopParams.pageNumber=1;//to solve page number issue
    this.getProducts();
  }

  onTypeIdSelected(typeId:number)
  {
    this.shopParams.typeId=typeId;
    this.shopParams.pageNumber=1;//to solve page number issue
    this.getProducts();
  }

  onSortSelected(sort:string)
  {
    this.shopParams.sort=sort;
    this.getProducts();
  }

  onPageChanged(event:any)
  {
    if(this.shopParams.pageNumber!==event) //to solve duplicate api call when click on filter
    {
      this.shopParams.pageNumber=event;
      this.getProducts();
    }
    
  }

  onSearch()
  {
    this.shopParams.search=this.searchTerm.nativeElement.value;
    this.shopParams.pageNumber=1;//to solve page number issue
    this.getProducts();
  }

  onReset()
  {
    this.searchTerm.nativeElement.value='';
    this.shopParams=new ShopParams();//reset all filter with default value
    this.getProducts();//to get unfilter products information
  }

}
