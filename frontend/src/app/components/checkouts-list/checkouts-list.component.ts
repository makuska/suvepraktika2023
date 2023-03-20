import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from '../../models/page';
import { PageEvent, MatPaginator } from "@angular/material/paginator";
import { CheckoutService } from "../../services/checkout.service";
import { Checkout } from "../../models/checkout";

@Component({
  selector: 'app-checkouts-list',
  templateUrl: './checkouts-list.component.html',
  styleUrls: ['./checkouts-list.component.css']
})
// https://angular.io/api/core/OnInit
export class CheckoutsListComponent implements OnInit{

  checkouts$!: Observable<Page<Checkout>>; //hmm
  pageSize: number = 10;
  pageIndex: number = 0;
  currentPageSize: number = this.pageSize;

  constructor( private checkoutService: CheckoutService) {}
  ngOnInit(): void {
    // TODO this observable should emit books taking into consideration pagination, sorting and filtering options.
    this.checkouts$ = this.checkoutService.getCheckouts({pageSize: this.pageSize});
  }

  changePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.currentPageSize = event.pageSize;
    this.getCheckouts();
  }

}
