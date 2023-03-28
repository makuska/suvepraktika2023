import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import {Page, SortDirection} from '../../models/page';
import { PageEvent, MatPaginator } from "@angular/material/paginator";
import { CheckoutService } from "../../services/checkout.service";
import { Checkout } from "../../models/checkout";
import { Sort } from "@angular/material/sort";
import {Book} from "../../models/book";

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

  sortColumn?: string;
  sortDirection?: SortDirection;

  // book: Book = {
  //
  // }

  constructor(private checkoutService: CheckoutService, ) {}

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
    let sort = sortColumn;

    if (sortColumn === 'title' || sortColumn === 'author' || sortColumn === 'year') {
      sort = 'borrowedBook.' + sortColumn;
    }
    if (sortColumn === 'borrower') {
      sort = 'borrowerFirstName';
    }
    if (sortColumn === 'checkoutDate') {
      sort = 'checkedOutDate';
    }

    if (this.sortColumn === sortColumn) {
      if (this.sortDirection === 'asc') {
        this.sortDirection = 'desc';
      } else if (this.sortDirection === 'desc') {
        this.sortColumn = '';
        this.sortDirection = '';
      } else {
        this.sortDirection = 'asc';
      }
    } else {
      this.sortColumn = sortColumn;
      this.sortDirection = 'asc';
    }

    const direction = this.sortDirection;
    const pageIndex = this.pageIndex;
    const pageSize = this.currentPageSize;

    console.log(this.sortDirection);

    this.checkouts$ = this.checkoutService.getCheckouts({pageIndex, pageSize, sort, direction});
  }


  getOverDueStyle(checkout: Checkout) {
    const isOverDue = this.checkoutService.isOverDue(checkout);
    return {
      'color': isOverDue ? 'red' : 'inherit',
      'opacity': isOverDue ? '0.5' : '1',
      'font-weight': isOverDue ? 'bold' : 'normal',
    };
  }

}
