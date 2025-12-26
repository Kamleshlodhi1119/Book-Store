import { Book } from './book';

export interface OrderItem {
  book: Book;
  quantity: number;
  price: number;
}
