export interface AdminOrder {
  id: number;
  status: string;
  totalAmount: number;
  createdAt: string;

  userEmail: string;

  items: {
    bookId: number;
    title: string;
    quantity: number;
    price: number;
  }[];
}
