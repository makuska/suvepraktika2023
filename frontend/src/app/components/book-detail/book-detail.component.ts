import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss']
})
export class BookDetailComponent implements OnInit {
  book$!: Observable<Book>;
  book: Book | undefined;


  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
  ) {
  }

  // https://gist.github.com/makuska/84457e0b6f614301b14575aaeaa0d917#ngoninit-void--thisbook--thisrouteparams-pipemapparams--paramsid-pipeswitchmapid--thisbookservicegetbookid
  ngOnInit(): void {
    this.book$ = this.route.params
      .pipe(map(params => params['id']))
      .pipe(switchMap(id => this.bookService.getBook(id)))
  }

  // https://www.w3schools.com/jsref/met_win_confirm.asp
  deleteThisBook(book: Book): void{
    if (confirm("Do you want to delete the '" + book.title + "' book?")){
      console.log(book.id);
      console.log(this.bookService.getBook('ab1a8f87-272d-4ba0-93df-dbb8952909df'));
      this.bookService.deleteBook(book.id).subscribe(() => {
        window.location.reload();
      })
    }
  }
  /*
  zsh: frontend % curl -X DELETE 'http://localhost:8080/api/book/deleteBook?bookId=ab1a8f87-272d-4ba0-93df-dbb8952909df'
{"timestamp":"2023-03-23T18:50:46.313+00:00","status":500,"error":"Internal Server Error","message":"","path":"/api/book/deleteBook"}%
  */

  // Might need to add hover css, so that the button indicates that the book is unavailable for checkout.
  // Or add an if statement, if (book.status === 'BORROWED' && click()) then; alert user (can't checkout borrowed books) and reload?
  checkoutThisBook(book: Book): void {
    if (book.status === 'AVAILABLE') {
      // The confirm() method returns true if the user clicked "OK", otherwise false.
      if (confirm("Do you want to check out '" + book.title + "'?")) {
        book.status = 'BORROWED';
        this.bookService.saveBook(book).subscribe(() => {
          // Reload the book details to update the status
          this.ngOnInit();
        });
      }
    }
  }

}
