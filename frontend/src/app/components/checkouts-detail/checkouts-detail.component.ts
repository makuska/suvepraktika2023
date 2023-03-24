import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {Checkout} from "../../models/checkout";
import {CheckoutService} from "../../services/checkout.service";
import {map, switchMap} from "rxjs/operators";
import {ActivatedRoute} from "@angular/router";
import {BookService} from "../../services/book.service";

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
    // I feel like this could be done more efficiently, since currently I'm constructing a new object, but...
    const book = checkout.borrowedBook;
    book.id = checkout.borrowedBook.id;
    book.title = checkout.borrowedBook.title;
    book.author = checkout.borrowedBook.author;
    book.genre = checkout.borrowedBook.genre;
    book.year = checkout.borrowedBook.year;
    book.added = checkout.borrowedBook.added;
    book.status = 'AVAILABLE';
    book.dueDate = null; // database has null values for 'AVAILABLE' books tho?
    console.log(book);
    /*Object { id: "fc80bbda-18f8-4695-af8f-6044dbbe9ce2", title: "The Far-Distant Oxus", author: "Larry Rath", genre: "Fanfiction",
    year: 1957, added: "2006-04-16", checkOutCount: 3, status: "AVAILABLE", dueDate: null, comment: null }
    */
    this.bookService.saveBook(book).subscribe(() => {
      console.log('Book saved successfully!');
    }); // 404 ERROR..
    //
    this.checkoutService.deleteCheckout(checkout.id).subscribe(() => {
      console.log('Checkout deleted successfully!');
    }); // status 200
  }


}
