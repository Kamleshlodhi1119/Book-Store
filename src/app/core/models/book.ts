export interface Book {
  id: number;
  title: string;
  authorName: string;
  description: string;
  price: number;
  stockQuantity: number;
  isbn?: string;
  imageUrl?: string | null;   // ✅ optional
  averageRating?: number;
  active: boolean;
}
