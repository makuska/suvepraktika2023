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
  getCheckouts(filter: Partial<PageRequest>): Observable<Page<Checkout>> {
    const url = this.baseUrl + '/getCheckouts';
    const params = RestUtil.buildParamsFromPageRequest(filter);
    return this.http.get<Page<Checkout>>(url, {params});
  }

  getCheckout(checkoutId: string): Observable<Checkout> {
    const url = this.baseUrl + '/getCheckout';
    const params = new HttpParams().set('checkOutId', checkoutId);
    return this.http.get<Checkout>(url, {params});
  }

  saveCheckout(checkoutId: Checkout): Observable<void> {
    const url = this.baseUrl + '/saveCheckout';
    return this.http.post<void>(url, checkoutId);
  }

  deleteCheckout(checkoutId: string): Observable<void> {
    const url = this.baseUrl + '/checkout'; // if '/checkout' is used then it works
    const params = new HttpParams().set('checkOutId', checkoutId);
    return this.http.delete<void>(url, {params});
  }

  isOverDue(checkout: Checkout): boolean {
    if (!checkout.dueDate) {
      return false;
    }
    const today = new Date();
    let dateToString = checkout.dueDate;
    let year = dateToString.substring(0, 4);
    let month = dateToString.substring(5, 7);
    let day = dateToString.substring(8, 10);

    let date = new Date(parseInt(year), parseInt(month)-1, parseInt(day));

    return date < today;
  }

  generateRandomString(): string {
    const groups = [
      this.generateRandomGroup(8),
      this.generateRandomGroup(4),
      this.generateRandomGroup(4),
      this.generateRandomGroup(4),
      this.generateRandomGroup(12),
    ];
    return groups.join("-");
  }

  generateRandomGroup(length: number): string {
    const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
}
