import { Component, OnInit } from '@angular/core';
import { Book, BookService } from 'src/app/core/services/book.service';
import { CartService } from 'src/app/core/services/cart.service';
import { WishlistService } from 'src/app/core/services/wishlist.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})


export class ShopComponent implements OnInit {
  books: Book[] = [];
  filtered: Book[] = [];
  paginated: Book[] = [];
  authors: Array<{ name: string }> = [];

  loading = true;
  loadFailed = false;
  maxBookPrice = 0;

  // Pagination
  currentPage = 1;
  pageSize = 12;
  totalPages = 0;
  pages: number[] = [];

  filters = {
    name: '',
    author: '',
    maxPrice: 0
  };

  constructor(
    private bookService: BookService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadBooks();
    this.loadAuthors();
    this.route.queryParamMap.subscribe(params => {
      this.filters.author = params.get('author') || '';
      if (!this.loading) {
        this.applyFilters();
      }
    });
  }

  loadBooks() {
    this.loading = true;
    this.loadFailed = false;

    this.bookService.getAll().subscribe({
      next: res => {
        this.books = res;
        this.filtered = [...this.books];

        this.maxBookPrice = this.books.reduce((max, book) => Math.max(max, book.price || 0), 0);
        this.filters.maxPrice = this.maxBookPrice;

        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.alertService.show('Failed to load books', 'error');
        this.loadFailed = true;
        this.loading = false;
      }
    });
  }

  loadAuthors() {
    this.bookService.getAuthors().subscribe({
      next: res => {
        this.authors = res
          .map(author => typeof author === 'string' ? author : author?.name)
          .filter((name): name is string => typeof name === 'string' && name.trim().length > 0)
          .map(name => ({ name }));
      },
      error: () => this.alertService.show('Failed to load authors', 'error')
    });
  }

  applyFilters() {
    const name = this.filters.name.trim().toLocaleLowerCase();
    const author = this.filters.author.toLocaleLowerCase();
    this.filtered = this.books.filter(book =>
      (!name || book.title.toLocaleLowerCase().includes(name)) &&
      (!author || book.authorName.toLocaleLowerCase() === author) &&
      book.price <= this.filters.maxPrice
    );
    this.currentPage = 1;
    this.setupPagination();
  }

  resetFilters(): void {
    this.filters = {
      name: '',
      author: '',
      maxPrice: this.maxBookPrice
    };
    this.applyFilters();
    if (this.route.snapshot.queryParamMap.has('author')) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { author: null },
        queryParamsHandling: 'merge',
        replaceUrl: true
      });
    }
  }

  // ------------------------
  // PAGINATION CORE
  // ------------------------

  setupPagination() {
    this.totalPages = Math.ceil(this.filtered.length / this.pageSize);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.updatePage();
  }

  updatePage() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginated = this.filtered.slice(start, end);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePage();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  nextPage() {
    this.goToPage(this.currentPage + 1);
  }

  prevPage() {
    this.goToPage(this.currentPage - 1);
  }

  // ------------------------
  // ACTIONS
  // ------------------------

  addToCart(bookId: number) {
    this.cartService.add({ bookId, quantity: 1 }).subscribe({
      next: msg => this.alertService.show(msg, 'success'),
      error: () => this.alertService.show('Add to cart failed', 'error')
    });
  }

  addToWishlist(bookId: number) {
    this.wishlistService.add(bookId).subscribe({
      next: () => this.alertService.show('Added to wishlist', 'success'),
      error: () => this.alertService.show('Wishlist failed', 'error')
    });
  }

  viewBook(id: number) {
    this.router.navigate(['/book-details', id]);
  }

  trackBookById(_index: number, book: Book): number {
    return book.id;
  }
}
