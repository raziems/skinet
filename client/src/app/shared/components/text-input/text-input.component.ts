import { Component, ElementRef, Input, OnInit, Self, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';//to access controller in form

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss']
})
export class TextInputComponent implements OnInit, ControlValueAccessor {
@ViewChild('input', {static:true}) input:ElementRef;
@Input() type='text';
@Input() label:string;

  constructor(@Self() public controlDir: NgControl) { //@Self angular dependency 
    this.controlDir.valueAccessor=this;
  }
  ngOnInit(): void {
    const control=this.controlDir.control;
    const Validators=control.validator? [control.validator]:[];
    const asyncValidators=control.asyncValidator? [control.asyncValidator]:[];

    control.setValidators(Validators);
    control.setAsyncValidators(asyncValidators);
    control.updateValueAndValidity();//try to validate form on initialization
  }

  onChange(event){}
  onTouched(){}

  writeValue(obj: any): void {
    this.input.nativeElement.value=obj || '';
  }
  registerOnChange(fn: any): void {
    this.onChange=fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched=fn;
  }
  
}

  


