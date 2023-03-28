import { Component, OnInit } from '@angular/core';
import { Book } from "../../models/book";

@Component({
  selector: 'app-favourite-books',
  templateUrl: './favourite-books.component.html',
  styleUrls: ['./favourite-books.component.css']
})
export class FavouriteBooksComponent implements OnInit {

  favourites: Book[] = [];

  constructor() { }

  ngOnInit(): void {
    const storedFavourites = localStorage.getItem('favourite_books');
    if (storedFavourites !== null) {
      this.favourites = JSON.parse(storedFavourites);
    }
  }


}
