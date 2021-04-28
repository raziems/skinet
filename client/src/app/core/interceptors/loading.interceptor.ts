import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { BusyService } from '../services/busy.service';
import { delay, finalize } from 'rxjs/operators';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private busyService: BusyService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(!req.url.includes('emailexists')) //to filter and don't display spinner while checking email address in register form
    {
      this.busyService.busy();
    }

    
    return next.handle(req).pipe(
      delay(1000),
      finalize(()=>{ //to turn-off spinner
        this.busyService.idle();
      })
    );
  }
}
