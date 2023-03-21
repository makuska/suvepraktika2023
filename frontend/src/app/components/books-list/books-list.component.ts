import { Component, OnInit, ViewChild } from '@angular/core';
import { BookService } from '../../services/book.service';
import { Observable } from 'rxjs';
import { Page } from '../../models/page';
import { Book } from '../../models/book';
import { PageEvent, MatPaginator } from "@angular/material/paginator";
import { Sort } from '@angular/material/sort';


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
  constructor( private bookService: BookService,) {}

  ngOnInit(): void {
    // TODO this observable should emit books taking into consideration pagination, sorting and filtering options.
    this.books$ = this.bookService.getBooks({pageSize: this.pageSize}); // changing the pageSize, when user enters the "/books" resource
  }

  changePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.currentPageSize = event.pageSize;
    this.books$ = this.bookService.getBooks({
      pageSize: this.currentPageSize,
      pageIndex: this.pageIndex
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

}
