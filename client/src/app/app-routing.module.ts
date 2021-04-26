import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './core/not-found/not-found.component';
import { ServerErrorComponent } from './core/server-error/server-error.component';
import { TestErrorComponent } from './core/test-error/test-error.component';
import { HomeComponent } from './home/home.component';
import { ProductDetailsComponent } from './shop/product-details/product-details.component';
import { ShopComponent } from './shop/shop.component';

const routes: Routes = [
  {path:'', component: HomeComponent}, //for homepage
  {path:'test-error', component: TestErrorComponent},
  {path:'server-error', component: ServerErrorComponent},
  {path:'not-found', component: NotFoundComponent},
  //{path:'shop', component:ShopComponent},
  //{path:'shop/:id', component:ProductDetailsComponent},

  //Lazy loading
  {path:'shop', loadChildren:()=> import('./shop/shop.module').then(mod=> mod.ShopModule)},
  {path:'**', redirectTo:'', pathMatch:'full'}//redirect to homepage if someone try to play around with the URL
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
