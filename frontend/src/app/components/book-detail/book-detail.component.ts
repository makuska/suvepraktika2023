import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import {Checkout} from "../../models/checkout";
import {CheckoutService} from "../../services/checkout.service";

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss']
})
export class BookDetailComponent implements OnInit {
  book$!: Observable<Book>;
  // book: Book | undefined; // no constructor, hence why undefined
  borrowerFirstName: string = '';
  borrowerLastName: string = '';



  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private checkoutService: CheckoutService,
  ) {
  }

  // https://gist.github.com/makuska/84457e0b6f614301b14575aaeaa0d917#ngoninit-void--thisbook--thisrouteparams-pipemapparams--paramsid-pipeswitchmapid--thisbookservicegetbookid
  ngOnInit(): void {
    this.book$ = this.route.params
      .pipe(map(params => params['id']))
      .pipe(switchMap(id => this.bookService.getBook(id)))
  }

  // TODO redirect user to Library/Checkouts after action

  // https://www.w3schools.com/jsref/met_win_confirm.asp
  deleteThisBook(book: Book): void{
    if (confirm("Do you want to delete the '" + book.title + "' book?")){
      console.log(book.id);
      console.log(this.bookService.getBook('ab1a8f87-272d-4ba0-93df-dbb8952909df'));
      this.bookService.deleteBook(book.id).subscribe(() => {
        alert("Book deleted successfully!");
        window.location.reload();
      }) //Backend needs to throw an exception if id doesn't exist (currently it deletes the book and then sends a 500 error)
    }
  }
  /*
  zsh: frontend % curl -X DELETE 'http://localhost:8080/api/book/deleteBook?bookId=ab1a8f87-272d-4ba0-93df-dbb8952909df'
  {"timestamp":"2023-03-23T18:50:46.313+00:00","status":500,"error":"Internal Server Error","message":"","path":"/api/book/deleteBook"}%
  */

  // Might need to add hover css, so that the button indicates that the book is unavailable for checkout.
  // TODO check if user has filled the first and last name
  checkoutThisBook(book: Book): void { //
    // Implement the name check for !empty values
    if (book.status === 'AVAILABLE') {
      // The confirm() method returns true if the user clicked "OK", otherwise false.
      if (confirm("Do you want to check out '" + book.title + "'?")) {
        book.status = 'BORROWED';
        book.checkOutCount += 1;
        let checkoutDate = new Date();
        checkoutDate.setDate(checkoutDate.getDate() + 60); // kinda long...
        book.dueDate = checkoutDate.toString().substring(0, 10); // 'yyyy-mm-dd'

        // this.bookService.deleteBook(book.id).subscribe(() => console.log("Temp delete")); // Working
        const checkout: Checkout = {
          id: book.id,
          borrowerFirstName: this.borrowerFirstName,
          borrowerLastName: this.borrowerLastName,
          borrowedBook: book,
          // https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd
          checkedOutDate: new Date().toISOString().split('T')[0],
          dueDate: checkoutDate.toString().substring(0, 10)
        }
        console.log(book);
        console.log(checkout);
        this.checkoutService.saveCheckout(checkout).subscribe(() => console.log("Checkout saved!"));
        // subscribe() method is used because it needs to wait for the response from the server after the HTTP POST request is made.
        this.bookService.saveBook(book).subscribe(() => {
          // Reload the book details to update the status (From 'AVAILABLE' to 'BORROWED')
          /* By calling ngOnInit() method, the component will reload and the updated book details will be displayed.
          This is because ngOnInit() is a lifecycle hook in Angular that is called after the component is initialized,
          and it is commonly used to perform initialization tasks such as fetching data and updating the view. */
          this.ngOnInit(); //https://stackoverflow.com/questions/35763730/difference-between-constructor-and-ngoninit
          console.log("Book updated/saved"!);
        });
      }
    }
  } //400 ERROR:

}
