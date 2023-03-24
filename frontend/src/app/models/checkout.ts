// TODO what elements should the checkout page display?
import { Book } from "./book";

export interface Checkout {
  id: string;
  borrowerFirstName: string;
  borrowerLastName: string;
  borrowedBook: Book;
  checkedOutDate: string;
  dueDate: string;
}
