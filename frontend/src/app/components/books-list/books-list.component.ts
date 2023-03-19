import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { Observable } from 'rxjs';
import { Page } from '../../models/page';
import { PageRequest } from '../../models/page';
import { Book } from '../../models/book';


@Component({
  selector: 'app-books-list',
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.scss']
})
export class BooksListComponent implements OnInit {

  books$!: Observable<Page<Book>>;
  pageSize = 10; // Default value for items per page
  pageSizeOptions = [5, 10, 25, 100];
  pageIndex = 0; // Start paging at 0
  constructor(
    private bookService: BookService,
  ) {
  }

  ngOnInit(): void {
    // TODO this observable should emit books taking into consideration pagination, sorting and filtering options.
    this.books$ = this.bookService.getBooks({pageSize: this.pageSize}); // changing the pageSize, when user enters the "/books" resource
  }

  // Source: OpenAI (tried to use an unknown component?) and https://keepgrowing.in/angular/handle-server-side-pagination-in-an-angular-application/
  changePage(event: any) {
    this.books$ = this.bookService.getBooks({pageIndex: event.pageIndex, pageSize: event.pageSize});
    this.pageIndex = event.pageIndex;
  }
}
