import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.scss']
})
export class PagerComponent implements OnInit {
@Input() totalCount:number; //received from parent component
@Input() pageSize :number;
@Output() pageChanged=new EventEmitter<number>(); //child to parent
  constructor() { }

  ngOnInit(): void {
  }

  //method
  onPagerChange(event:any)
  {
    this.pageChanged.emit(event.page); //page is number
  }

}
