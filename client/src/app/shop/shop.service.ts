import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBrand } from '../shared/models/brand';
import { IPagination } from '../shared/models/pagination';
import { IType } from '../shared/models/productType';
import {map} from 'rxjs/operators';
import { ShopParams } from '../shared/models/shopParams';
import { IProduct } from '../shared/models/product';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  baseUrl="https://localhost:5001/api/"

  //http:HttClient to get the data from API when application start
  constructor(private http:HttpClient) { }

  getProducts(shopParams: ShopParams)//(brandId?:number, typeId?:number, sort?:string) //? indicate the parameter is optional
  {
    let params= new HttpParams();

    if (shopParams.brandId !==0){
      params=params.append('brandId',shopParams.brandId.toString());
    }

    if(shopParams.typeId !==0)
    {
      params=params.append('typeId', shopParams.typeId.toString());
    }

    if (shopParams.search){
      params=params.append('search', shopParams.search);
    }

    params=params.append('sort', shopParams.sort);
    params=params.append('pageIndex', shopParams.pageNumber.toString());
    params=params.append('pageSize', shopParams.pageSize.toString());
    

    return this.http.get<IPagination>(this.baseUrl+ 'products', {observe:'response', params})//will return httpsreponse instead of body
    .pipe( //pipe allow to manipulate rxjs operator
      map( response=>
        {
          return response.body;
        })
    )  
  }

  getProduct(id:number)
  {
    return this.http.get<IProduct>(this.baseUrl + 'products/' + id);
  }

  getBrands()
  {
    return this.http.get<IBrand[]>(this.baseUrl+'products/brands');
  }

  getTypes()
  {
    return this.http.get<IType[]>(this.baseUrl +'products/types')
  }
}
