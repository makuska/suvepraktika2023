import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BooksListComponent } from './components/books-list/books-list.component';
import { BookDetailComponent } from './components/book-detail/book-detail.component';

// https://gist.github.com/makuska/84457e0b6f614301b14575aaeaa0d917#routing-in-angular
const routes: Routes = [
  {path: '', redirectTo: 'books', pathMatch: 'full'}, // Default route
  {path: 'books', component: BooksListComponent}, // Books route
  {path: 'books/:id', component: BookDetailComponent} // Books detail route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
