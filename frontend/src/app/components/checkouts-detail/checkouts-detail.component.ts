import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {Checkout} from "../../models/checkout";
import {CheckoutService} from "../../services/checkout.service";
import {map, switchMap} from "rxjs/operators";
import {ActivatedRoute, Router} from "@angular/router";
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
    private bookService: BookService,
    private router: Router,
  ) {
  }

  changeDueDateText(checkout: Checkout){
    const isOverDue = this.checkoutService.isOverDue(checkout);
    if (isOverDue) {
      return {
        'color': 'red',
        'opacity': '0.5',
        'font-weight': 'bold',
      };
    } else {
      return {
        'color': 'inherit',
        'opacity': '1',
        'font-weight': 'normal',
      };
    }
  }



  ngOnInit(): void {
    this.checkout$ = this.route.params
      .pipe(map(params => params['id']))
      .pipe(switchMap(id => this.checkoutService.getCheckout(id)))
    console.log(this.checkout$)

  }

  // TODO DEBUGGING!!!
  // https://gist.github.com/makuska/84457e0b6f614301b14575aaeaa0d917#endpoint-debugging

  returnThisCheckout(checkout: Checkout): void{
    /*Object { id: "fc80bbda-18f8-4695-af8f-6044dbbe9ce2", borrowerFirstName: "John", borrowerLastName: "Gusikowski",
    borrowedBook: {…}, checkedOutDate: "2020-09-11", dueDate: null, returnedDate: null, title: "The Far-Distant Oxus",
    author: "Larry Rath", genre: "Fanfiction", … }*/
    const book = checkout.borrowedBook;
    book.status = 'AVAILABLE';
    book.dueDate = null; // database has null values for 'AVAILABLE' books tho?
    console.log(book);
    // this.bookService.deleteBook(book.id).subscribe(() => console.log("Updating book details"));
    this.bookService.saveBook(book).subscribe(() => console.log('Book saved successfully!')); // 200
    this.checkoutService.deleteCheckout(checkout.id).subscribe(() => {
      console.log('Checkout deleted successfully!');
      alert("Book returned successfully!");
      this.router.navigate(["/checkouts"]);
      // Should force a reload on the /books:id route, when book is returned?
    }); // 200
  }


}
