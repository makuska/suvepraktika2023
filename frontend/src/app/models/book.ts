import { BookStatus } from './book-status';

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  year: number;
  added: string;
  checkOutCount: number;
  status: BookStatus;
  dueDate: string | null; //https://stackoverflow.com/questions/17220114/how-to-declare-a-type-as-nullable-in-typescript
  comment: string;
  favourite: boolean;
}
