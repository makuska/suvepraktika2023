import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book';
import { Observable } from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
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
  borrowerFirstName: string = '';
  borrowerLastName: string = '';



  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private checkoutService: CheckoutService,
    private router: Router
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
      if (book.status === 'BORROWED'){
        alert("Can't delete a borrowed book!")
        return;
      }
      console.log(book.id);
      this.bookService.deleteBook(book.id).subscribe(() => {
        alert("Book deleted successfully!");
        // window.location.reload();
        // https://stackoverflow.com/questions/38131293/angular-2-router-navigate
        this.router.navigate(["/books"]); // ROuting user back to "/books"
      }) //Backend needs to throw an exception if id doesn't exist
    }
  }

  checkoutThisBook(book: Book): void { //
    // Implement the name check for !empty values
    if (book.status === 'AVAILABLE') {
      if (!this.bookService.isValidInput(this.borrowerFirstName)) {
        alert('Invalid first name. Special characters are not allowed.');
        return;
      }
      if (!this.bookService.isValidInput(this.borrowerLastName)) {
        alert('Invalid last name. Special characters are not allowed.');
        return;
      }
      // The confirm() method returns true if the user clicked "OK", otherwise false.
      if (confirm("Do you want to check out '" + book.title + "'?")) {
        book.status = 'BORROWED';
        book.checkOutCount += 1;
        let checkoutDate = new Date();
        checkoutDate.setDate(checkoutDate.getDate() + 60);
        book.dueDate = checkoutDate.toISOString().substring(0, 10); // 'yyyy-mm-dd'
        // https://gist.github.com/makuska/84457e0b6f614301b14575aaeaa0d917#debugging-journey

        const checkout: Checkout = {
          id: this.checkoutService.generateUUID(),
          // id: book.id,
          borrowerFirstName: this.borrowerFirstName,
          borrowerLastName: this.borrowerLastName,
          borrowedBook: book,
          // https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd
          checkedOutDate: new Date().toISOString().split('T')[0],
          dueDate: checkoutDate.toISOString().substring(0, 10)
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
  } //404 ERROR:

}
