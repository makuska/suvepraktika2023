import { Component, OnInit, ViewChild } from '@angular/core';
import { BookService } from '../../services/book.service';
import {Observable, startWith} from 'rxjs';
import { Page } from '../../models/page';
import { Book } from '../../models/book';
import { PageEvent, MatPaginator } from "@angular/material/paginator";
import { Sort } from '@angular/material/sort';
import {map} from "rxjs/operators";


@Component({
  selector: 'app-books-list',
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.scss']
})
export class BooksListComponent implements OnInit {

  books$!: Observable<Page<Book>>;
  pageSize: number = 10; // Default value for items per page
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageIndex: number = 0; // Start paging at 0
  currentPageSize: number = this.pageSize;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  selectedStatus = '';
  constructor( private bookService: BookService,) {}

  ngOnInit(): void {
    // TODO this observable should emit books taking into consideration pagination, sorting and filtering options.
    this.books$ = this.bookService.getBooks({
      pageSize: this.pageSize,
      status: this.selectedStatus,
    });
  }

  changePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.currentPageSize = event.pageSize;
    this.books$ = this.bookService.getBooks({
      pageSize: this.currentPageSize,
      pageIndex: this.pageIndex,
      status: this.selectedStatus,
      // sortColumn: sortColumn,
      // sortDirection: sortDirection,
    });
  }

  sortCurrentPage(event: Sort): void {
    const sortColumn = event.active;
    const sortDirection = event.direction;
    this.books$ = this.bookService.getBooks({
      pageIndex: this.pageIndex,
      pageSize: this.currentPageSize,
      sort: sortColumn,
      direction: sortDirection
    });
  }

  filterByStatus(status: string): void {
    this.selectedStatus = status;
    this.books$ = this.bookService.getBooks({
      status: this.selectedStatus,
    });
    this.paginator.firstPage();
    console.log("filterByStatus method works, if you see me");
    console.log(status + " check if this works as well")
    console.log(this.books$); // From console, Objects length = 1
  }
}
