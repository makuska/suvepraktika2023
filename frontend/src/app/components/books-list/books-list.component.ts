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
    console.log(sortDirection);
    this.books$ = this.bookService.getBooks({
      pageIndex: this.pageIndex,
      pageSize: this.currentPageSize,
      sort: sortColumn,
      direction: sortDirection // not working
    });
    console.log(sortColumn, sortDirection);
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
    this.paginator.firstPage();
    this.pageIndex = 0;
    this.search = search;
    if (search) {
      this.books$ = this.bookService.getBooks({
        search: this.search,
        pageIndex: this.pageIndex,
        pageSize: 1000, //hardcoded 1000, because there are 1000 books.
      }).pipe( //https://vegibit.com/how-to-make-http-requests-in-angular-using-observables/
        map((page: Page<Book>) => {
          const filteredBooks = page.content.filter((book: Book) => {
            return book.title.toLowerCase().includes(search.toLowerCase());
          });
          if (filteredBooks.length === 0) {
            alert("The " + this.search + " book you searched for doesn't exist!");
            // location.reload(); Could also force a reload on the application, currently it goes back to the first page.
            this.books$ = this.bookService.getBooks({
              pageIndex: this.pageIndex,
              pageSize: this.pageSize,
            });
          }
          return { ...page, content: filteredBooks };
        })
      );
    } else {
      alert("Please enter a search query");
      this.books$ = this.bookService.getBooks({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
      });
    }
    // this.paginator.firstPage(); // Request needs to be made twice, since it only goes to the first page, and then user
    // has to search for the book again.
  }
}

