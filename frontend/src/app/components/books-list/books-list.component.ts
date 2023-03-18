import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { Observable } from 'rxjs';
import { Page } from '../../models/page';
import { Book } from '../../models/book';


@Component({
  selector: 'app-books-list',
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.scss']
})
export class BooksListComponent implements OnInit {

  books$!: Observable<Page<Book>>;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 100];

  constructor(
    private bookService: BookService,
  ) {
  }

  ngOnInit(): void {
    // TODO this observable should emit books taking into consideration pagination, sorting and filtering options.
    this.books$ = this.bookService.getBooks({page: 0, size: this.pageSize}); //not really sure what's the issue here...
  }

  onPageChange(event: any) {
    this.books$ = this.bookService.getBooks({page: event.pageIndex, size: event.pageSize});
  }
}
