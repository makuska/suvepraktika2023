// TODO what elements should the checkout page display?
import { Book } from "./book";

export interface Checkout {
  id: Book["id"]; //hmm
  fullName: string;
  title: string;
  author: string;
  checkoutDate: string;
  dueDate: string;
}
