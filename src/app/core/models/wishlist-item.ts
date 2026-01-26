export interface WishlistItem {
  id: number;
  bookId: number;
  title: string;
  imageUrl: string;
  price: number;
  isRemoving?: boolean;
}
