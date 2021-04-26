import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PaginationModule} from 'ngx-bootstrap/pagination';
import { PagingHeaderComponent } from './components/paging-header/paging-header.component';
import { PagerComponent } from './components/pager/pager.component';


@NgModule({
  declarations: [
    PagingHeaderComponent,
    PagerComponent
  ],
  imports: [
    CommonModule,
    PaginationModule.forRoot() //pagination has its own provider and need to injected into our routes module and start up 
  ],
  exports:[
    PaginationModule, 
    PagingHeaderComponent,
    PagerComponent
  ]
})
export class SharedModule { }
