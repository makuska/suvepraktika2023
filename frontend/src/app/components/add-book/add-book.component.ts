import {Component, Inject, InjectionToken, OnInit} from '@angular/core';
import {BookService} from "../../services/book.service";
import {Book} from "../../models/book";
import {BookStatus} from "../../models/book-status";
import {CheckoutService} from "../../services/checkout.service";

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent implements OnInit{

  today = new Date();

  book: Book = {
    id: this.checkoutService.generateUUID(),
    title: '',
    author: '',
    genre: '',
    year: 0,
    added: this.today.toISOString().substring(0, 10),
    checkOutCount: 0,
    status: 'AVAILABLE',
    dueDate: null,
    comment: '',
    // favourite: false
  };

  constructor(
    private bookService: BookService,
    // private bookStatus: BookStatus,
    private checkoutService: CheckoutService,
  ) {
  }
  ngOnInit(): void {
  }

  submitBook() {
    this.bookService.saveBook(this.book).subscribe(() => {
      console.log("Book saved successfully")
      console.log(this.book);
    }, () => { //Handle error!
      console.log("An error occurred while saving the book!")
    });
  }

}
