import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BooksListComponent } from './components/books-list/books-list.component';
import { BookDetailComponent } from './components/book-detail/book-detail.component';
import { CheckoutsListComponent } from "./components/checkouts-list/checkouts-list.component";
import { CheckoutsDetailComponent } from "./components/checkouts-detail/checkouts-detail.component";
import { FavouriteBooksComponent } from "./components/favourite-books/favourite-books.component";

// https://gist.github.com/makuska/84457e0b6f614301b14575aaeaa0d917#routing-in-angular
// https://angular.io/guide/router#defining-a-basic-route
const routes: Routes = [
  {path: '', redirectTo: 'books', pathMatch: 'full'}, // Default route
  {path: 'books', component: BooksListComponent}, // Books route
  {path: 'books/:id', component: BookDetailComponent}, // Books detail route
  {path: 'checkouts', component: CheckoutsListComponent}, // Checkouts route
  {path: 'checkouts/:id', component: CheckoutsDetailComponent}, // Checkouts detail route
  {path: 'favourite-books', component: FavouriteBooksComponent}, // Favourite books route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
