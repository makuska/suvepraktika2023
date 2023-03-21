import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {Page} from "../../models/page";
import {Checkout} from "../../models/checkout";
import {CheckoutService} from "../../services/checkout.service";
import {BookService} from "../../services/book.service";
import {map, switchMap} from "rxjs/operators";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-checkouts-detail',
  templateUrl: './checkouts-detail.component.html',
  styleUrls: ['./checkouts-detail.component.css']
})
export class CheckoutsDetailComponent implements OnInit{
  /*
  Here you can't use <Page> interface because two components display different types of data. Namely, checkouts-list displays
  paginated data of checkouts; checkout-detail just displays one object - checkout, not a paginated list.
  <Page> is an interface that defines the properties of a paginated data response.
   */
  checkout$!: Observable<Checkout>;

  constructor(
    private route: ActivatedRoute,
    private checkoutService: CheckoutService,
  ) {
  }

  ngOnInit(): void {
    this.checkout$ = this.route.params
      .pipe(map(params => params['id']))
      .pipe(switchMap(id => this.checkoutService.getCheckout(id)))
  }

}
