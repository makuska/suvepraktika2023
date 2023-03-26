import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Page, PageRequest } from '../models/page';
import { Book } from '../models/book';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RestUtil } from './rest-util';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private readonly baseUrl = environment.backendUrl + '/api/book';
  // https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
  private readonly FAVOURITE_BOOKS_KEY = 'favourite_books';


  constructor( private http: HttpClient, ) {}

  getBooks(filter: Partial<PageRequest>): Observable<Page<Book>> {
    const url = this.baseUrl + '/getBooks';
    const params = RestUtil.buildParamsFromPageRequest(filter);
    return this.http.get<Page<Book>>(url, {params});
  }

  getBook(bookId: string): Observable<Book> {
    const url = this.baseUrl + '/getBook';
    const params = new HttpParams().set('bookId', bookId);
    return this.http.get<Book>(url, {params});
  }

  saveBook(book: Book): Observable<void> {
    const url = this.baseUrl + '/saveBook';
    return this.http.post<void>(url, book);
  }

  deleteBook(bookId: string): Observable<void> {
    const url = this.baseUrl + '/deleteBook';
    const params = new HttpParams().set('bookId', bookId);
    return this.http.delete<void>(url, {params});
  }

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON
  addBookToFavourites(book: Book): void {
    const favouriteBooks = this.getFavouriteBooks();
    favouriteBooks.push(book);
    localStorage.setItem(this.FAVOURITE_BOOKS_KEY, JSON.stringify(favouriteBooks));
  }

  getFavouriteBooks(): Book[] {
    const favouriteBooksJson = localStorage.getItem(this.FAVOURITE_BOOKS_KEY);
    if (favouriteBooksJson) {
      return JSON.parse(favouriteBooksJson);
    }
    return [];
  }

  removeFavouriteBook(book: Book): void { // Source: ChatAI
    const favouriteBooks = this.getFavouriteBooks();
    const index = favouriteBooks.findIndex(b => b.id === book.id);
    if (index >= 0) {
      favouriteBooks.splice(index, 1);
      localStorage.setItem(this.FAVOURITE_BOOKS_KEY, JSON.stringify(favouriteBooks));
    }
  }

}
