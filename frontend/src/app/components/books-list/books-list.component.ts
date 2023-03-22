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
  search = '';
  constructor( private bookService: BookService,) {}

  ngOnInit(): void {
    // TODO this observable should emit books taking into consideration pagination, sorting and filtering options.
    this.books$ = this.bookService.getBooks({
      pageSize: this.pageSize,
    });
  }

  changePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.currentPageSize = event.pageSize;
    this.books$ = this.bookService.getBooks({
      pageSize: this.currentPageSize,
      pageIndex: this.pageIndex,
      statusFilter: this.selectedStatus,
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
      direction: sortDirection // not working
    });
  }

  filterByStatus(status: string): void {
    this.selectedStatus = status;
    this.books$ = this.bookService.getBooks({
      statusFilter: this.selectedStatus,
      pageIndex: this.pageIndex,
      pageSize: this.currentPageSize,
    });
    this.paginator.firstPage(); //https://gist.github.com/makuska/84457e0b6f614301b14575aaeaa0d917#thispaginatorfirstpage
  }
  /*
  Current Request looks like:
  GET http://localhost:8080/api/book/getBooks?page=0&size=10
  No status parameter in the GET request.
   */

  /*
  Thought about comparing the search result with Book objects id values, and if the id exists, then return a book.
  This way I don't have to create a new backend endpoint and can use the already existing endpoints.
  Couldn't get the searchByTitle method  working properly, so asked ChatAI to fix the method for me.
   */
  searchByTitle(search: string): void {
    this.search = search;
    if (search) {
      this.books$ = this.bookService.getBooks({
        search: this.search,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
      }).pipe(
        map((page: Page<Book>) => {
          const filteredBooks = page.content.filter((book: Book) => {
            return book.title.toLowerCase().includes(search.toLowerCase());
          });
          return { ...page, content: filteredBooks };
        })
      );
    } else {
      this.books$ = this.bookService.getBooks({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
      });
    }
  }


}
