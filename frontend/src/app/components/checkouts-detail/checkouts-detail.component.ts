import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {Checkout} from "../../models/checkout";
import {CheckoutService} from "../../services/checkout.service";
import {map, switchMap} from "rxjs/operators";
import {ActivatedRoute} from "@angular/router";
import {BookService} from "../../services/book.service";
import {Book} from "../../models/book";

@Component({
  selector: 'app-checkouts-detail',
  templateUrl: './checkouts-detail.component.html',
  styleUrls: ['./checkouts-detail.component.css']
})
export class CheckoutsDetailComponent implements OnInit{
  /*
  Here you can't use <Page> interface because two components display different types of data. Namely, checkouts-list displays
  paginated data of checkouts; checkout-detail just displays one object - checkout, not a paginated list.
  <Page> is an interface that defines the properties of a paginated data response.
   */
  checkout$!: Observable<Checkout>;

  constructor(
    private route: ActivatedRoute,
    private checkoutService: CheckoutService,
    private bookService: BookService
  ) {
  }

  ngOnInit(): void {
    this.checkout$ = this.route.params
      .pipe(map(params => params['id']))
      .pipe(switchMap(id => this.checkoutService.getCheckout(id)))
    console.log(this.checkout$)
  }

  // Method also needs: 'borrower_first_name', 'borrower_last_name'.
  returnThisCheckout(checkout: Checkout): void{
    // EDIT: logic flaw, here I'm creating a new book object, which is completely unnecessary, since I only need to update
    // the status of the book and set dueDate to null;
    // const book: Book = Object.assign({}, checkout, {
    //   id: checkout.borrowedBook.id,
    //   title: checkout.borrowedBook.title,
    //   author: checkout.borrowedBook.author,
    //   genre: checkout.borrowedBook.genre,
    //   year: checkout.borrowedBook.year,
    //   added: checkout.borrowedBook.added,
    //   status: 'AVAILABLE',
    //   dueDate: null // database has null values for 'AVAILABLE' books tho?
    // });
    // USING Object.assign results in Book AND Checkout object being created!
    /*Object { id: "fc80bbda-18f8-4695-af8f-6044dbbe9ce2", borrowerFirstName: "John", borrowerLastName: "Gusikowski",
    borrowedBook: {…}, checkedOutDate: "2020-09-11", dueDate: null, returnedDate: null, title: "The Far-Distant Oxus",
    author: "Larry Rath", genre: "Fanfiction", … }*/
    const book = checkout.borrowedBook;
    book.status = 'AVAILABLE';
    book.dueDate = null; // database has null values for 'AVAILABLE' books tho?
    console.log(book);
    /*Object { id: "fc80bbda-18f8-4695-af8f-6044dbbe9ce2", title: "The Far-Distant Oxus", author: "Larry Rath", genre: "Fanfiction",
    year: 1957, added: "2006-04-16", checkOutCount: 3, status: "AVAILABLE", dueDate: null, comment: null }*/
    this.bookService.deleteBook(book.id).subscribe(() => console.log("Updating book details"));
    this.bookService.saveBook(book).subscribe(() => console.log('Book saved successfully!')); // 200
    /* SyntaxError: JSON.parse: unexpected non-whitespace character after JSON data at line 1 column 2 of the JSON data
    text: "5fce2622-6217-4eed-8d1c-d255bae1c73e" */
    //
    this.checkoutService.deleteCheckout(checkout.id).subscribe(() => {
      console.log('Checkout deleted successfully!');
    }); // 404
  }


}
