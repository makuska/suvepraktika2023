import { BookStatus } from './book-status';

export interface Checkout {
  id: string;
  title: string;
  author: string;
  genre: string;
  year: number;
  added: string;
  checkOutCount: number;
  status: BookStatus;
  dueDate: string;
}
