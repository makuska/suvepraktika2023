// copy from book.service.ts
import { Injectable } from '@angular/core'; //https://gist.github.com/makuska/84457e0b6f614301b14575aaeaa0d917#import--injectable--from-angularcore
import { HttpClient, HttpParams } from '@angular/common/http'; //https://gist.github.com/makuska/84457e0b6f614301b14575aaeaa0d917#import--httpclient-httpparams--from-angularcommonhttp
import { Page, PageRequest } from '../models/page';
import { Checkout } from '../models/checkout';
import { Observable } from 'rxjs'; //https://gist.github.com/makuska/84457e0b6f614301b14575aaeaa0d917#import--observable--from-rxjs
import { environment } from 'src/environments/environment'; //https://gist.github.com/makuska/84457e0b6f614301b14575aaeaa0d917#import--environment--from-srcenvironmentsenvironment
import { RestUtil } from './rest-util';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private readonly baseUrl = environment.backendUrl + '/api/checkout';

  constructor( private http: HttpClient,) {}
  // Changed only the necessary method names and paths
  getCheckouts(filter: Partial<PageRequest>): Observable<Page<Checkout>> {
    const url = this.baseUrl + '/getCheckouts';
    const params = RestUtil.buildParamsFromPageRequest(filter);
    return this.http.get<Page<Checkout>>(url, {params});
  }

  getCheckout(checkoutId: string): Observable<Checkout> {
    const url = this.baseUrl + '/getCheckout';
    const params = new HttpParams().set('checkOutId', checkoutId);
    console.log(checkoutId);
    return this.http.get<Checkout>(url, {params});
  }

  saveCheckout(checkoutId: Checkout): Observable<void> {
    const url = this.baseUrl + '/saveCheckout';
    return this.http.post<void>(url, checkoutId);
  }

  deleteCheckout(checkoutId: string): Observable<void> {
    const url = this.baseUrl + '/deleteCheckout';
    const params = new HttpParams().set('checkOutId', checkoutId); //same flaw here :)
    return this.http.delete<void>(url, {params});
  }

}
