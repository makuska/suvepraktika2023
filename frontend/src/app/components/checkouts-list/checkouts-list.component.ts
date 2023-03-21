import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from '../../models/page';
import { PageEvent, MatPaginator } from "@angular/material/paginator";
import { CheckoutService } from "../../services/checkout.service";
import { Checkout } from "../../models/checkout";
import { Sort } from "@angular/material/sort";

@Component({
  selector: 'app-checkouts-list',
  templateUrl: './checkouts-list.component.html',
  styleUrls: ['./checkouts-list.component.css']
})
// https://angular.io/api/core/OnInit
export class CheckoutsListComponent implements OnInit{
  checkouts$!: Observable<Page<Checkout>>; // https://gist.github.com/makuska/84457e0b6f614301b14575aaeaa0d917#checkouts-observablepage
  pageSize: number = 10;
  pageIndex: number = 0;
  pageSizeOptions = [5, 10, 25, 100];
  currentPageSize: number = this.pageSize;
  // @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor( private checkoutService: CheckoutService) {}
  ngOnInit(): void {
    // TODO this observable should emit books taking into consideration pagination, sorting and filtering options.
    this.checkouts$ = this.checkoutService.getCheckouts({pageSize: this.pageSize});
  }

  changePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.currentPageSize = event.pageSize;
    this.checkouts$ = this.checkoutService.getCheckouts({
      pageSize: this.currentPageSize,
      pageIndex: this.pageIndex
    });
  }

  sortCurrentPage(event: Sort): void {
    const sortColumn = event.active;
    const sortDirection = event.direction;
    this.checkouts$ = this.checkoutService.getCheckouts({
      pageIndex: this.pageIndex,
      pageSize: this.currentPageSize,
      sort: sortColumn,
      direction: sortDirection
    });
  }

}
