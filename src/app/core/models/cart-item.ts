export interface CartItem {
  bookId: number;
  title: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface CartResponse {
  items: CartItem[];
  totalAmount: number;
}
