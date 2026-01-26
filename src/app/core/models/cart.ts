import { CartItem } from './cart-item';

export interface CartResponse {
  items: CartItem[];
  totalAmount: number;
}