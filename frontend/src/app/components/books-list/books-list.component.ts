import { Component, OnInit, ViewChild } from '@angular/core';
import { BookService } from '../../services/book.service';
import {Observable, startWith} from 'rxjs';
import {Page, PageRequest, SortDirection} from '../../models/page';
import { Book } from '../../models/book';
import { PageEvent, MatPaginator } from "@angular/material/paginator";
import { MatSort, Sort } from '@angular/material/sort';
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
  totalElements: number = 1000;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  selectedStatus = '';
  search = '';
  sortColumn?: string;
  sortDirection?: SortDirection;
  // @ViewChild(MatSort) sort: MatSort;
  constructor( private bookService: BookService, ) {}

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
      sort: this.sortColumn, // Sort is now working with paging as well
      direction: this.sortDirection
    });
  }

  // An updated version of the sort, the angular MatSort seemed tricky, used other logic here, passing either
  // 'asc', 'desc' or an empty string to url.
  sortCurrentPage(event: Sort): void {
    const sortColumn = event.active;

    // If the same column is clicked for the third time, clear the sort
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
      // Setting the initial sort to ascending
      this.sortColumn = sortColumn;
      this.sortDirection = 'asc';
    }

    // if sortColumn is an empty string, then 'undefined' is returned, otherwise this.sortColumn is returned.
    const sort = this.sortColumn === '' ? undefined : this.sortColumn;
    this.books$ = this.bookService.getBooks({
      pageIndex: this.pageIndex,
      pageSize: this.currentPageSize,
      sort: sort,
      direction: this.sortDirection
    });
    console.log(sortColumn, this.sortDirection);
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
    if(!this.bookService.isValidInput(search)){
      alert("Please enter characters and spaces only!");
      this.books$ = this.bookService.getBooks({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
      });
    }
    this.paginator.firstPage();
    this.pageIndex = 0;
    this.search = search;
    if (search) {
      this.books$ = this.bookService.getBooks({
        search: this.search,
        pageIndex: this.pageIndex,
        pageSize: this.totalElements, //hardcoded 1000, because there are 1000 books.
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

  isFavourite(book: Book): boolean {
    const favouriteBooks = this.bookService.getFavouriteBooks();
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
    // 'b' represents each element of the 'favouriteBooks' array.
    return favouriteBooks.some(b => b.id === book.id); // Source: ChatAI
  }

  toggleFavourite(book: Book): void {
    if (this.isFavourite(book)) {
      this.bookService.removeFavouriteBook(book);
    } else {
      this.bookService.addBookToFavourites(book);
    }
  }

}
