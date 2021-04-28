import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { NotFoundComponent } from './core/not-found/not-found.component';
import { ServerErrorComponent } from './core/server-error/server-error.component';
import { TestErrorComponent } from './core/test-error/test-error.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {path:'', component: HomeComponent,data: {breadcrumb: 'Home'}}, //for homepage
  {path:'test-error', component: TestErrorComponent, data: {breadcrumb: 'Test Errors'}},
  {path:'server-error', component: ServerErrorComponent,data: {breadcrumb: 'Server Error'}},
  {path:'not-found', component: NotFoundComponent, data: {breadcrumb: 'Not Found'}},
  //{path:'shop', component:ShopComponent},
  //{path:'shop/:id', component:ProductDetailsComponent},

  //Lazy loading
  {path:'shop', loadChildren:()=> import('./shop/shop.module').then(mod=> mod.ShopModule),
  data: {breadcrumb: 'Shop'}},
  {path:'basket', loadChildren:()=> import('./basket/basket.module').then(mod=> mod.BasketModule),
  data: {breadcrumb: 'Basket'}},
  {path:'checkout', 
  canActivate:[AuthGuard], //to protect this page if user not loggin
  loadChildren:()=> import('./checkout/checkout.module').then(mod=> mod.CheckoutModule),
  data: {breadcrumb: 'Checkout'}},
  {
    path: 'orders', 
    canActivate: [AuthGuard],
    loadChildren: () => import('./orders/orders.module').then(mod => mod.OrdersModule),
    data: { breadcrumb: 'Orders' }
  },
  {path:'account', loadChildren:()=> import('./account/account.module').then(mod=> mod.AccountModule),
  data: {breadcrumb: {skip:true}}}, //no breadcrumb skip:true
  {path:'**', redirectTo:'not-found', pathMatch:'full'}//redirect to homepage if someone try to play around with the URL
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
