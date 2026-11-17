import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { BookService } from 'src/app/core/services/book.service';
import { CartService } from 'src/app/core/services/cart.service';
import { WishlistService } from 'src/app/core/services/wishlist.service';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { Book } from 'src/app/core/services/book.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class UserHomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('blogSection', { static: true }) blogSection!: ElementRef<HTMLElement>;
  @ViewChild('blogPreviewHost', { read: ViewContainerRef, static: true })
  blogPreviewHost!: ViewContainerRef;

  books: Book[] = [];
  authors: { name: string }[] = [];
  displayAuthors: { name: string }[] = [];
  readonly maxAuthors = 4;
  booksLoading = true;
  booksFailed = false;
  authorsLoading = true;
  authorsFailed = false;
  blogPreviewLoading = true;
  blogPreviewFailed = false;
  private blogPreviewObserver?: IntersectionObserver;

  constructor(
    private bookService: BookService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private router: Router,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.loadBooks();
    this.loadAuthors();
  }

  ngAfterViewInit(): void {
    if (typeof IntersectionObserver === 'undefined') {
      this.loadBlogPreview();
      return;
    }

    this.blogPreviewObserver = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        this.blogPreviewObserver?.disconnect();
        this.loadBlogPreview();
      }
    }, { rootMargin: '240px 0px' });
    this.blogPreviewObserver.observe(this.blogSection.nativeElement);
  }

  ngOnDestroy(): void {
    this.blogPreviewObserver?.disconnect();
  }

  async loadBlogPreview(): Promise<void> {
    this.blogPreviewLoading = true;
    this.blogPreviewFailed = false;
    try {
      const { BlogPreviewComponent } = await import('../../blogs/blog-preview/blog-preview.component');
      this.blogPreviewHost.clear();
      this.blogPreviewHost.createComponent(BlogPreviewComponent);
    } catch {
      this.blogPreviewFailed = true;
    } finally {
      this.blogPreviewLoading = false;
    }
  }

  loadBooks(): void {
    this.booksLoading = true;
    this.booksFailed = false;
    this.bookService.getAll().subscribe({
      next: books => {
        this.books = books;
        this.booksLoading = false;
      },
      error: () => {
        this.booksFailed = true;
        this.booksLoading = false;
        this.alertService.show('Failed to load books', 'error');
      }
    });
  }

  loadAuthors(): void {
    this.authorsLoading = true;
    this.authorsFailed = false;
    this.bookService.getAuthors().subscribe({
      next: res => {
        this.authors = res
          .map(author => typeof author === 'string' ? author : author?.name)
          .filter((name): name is string => typeof name === 'string' && name.trim().length > 0)
          .map(name => ({ name }));
        this.pickRandomAuthors();
        this.authorsLoading = false;
      },
      error: () => {
        this.authorsLoading = false;
        this.authorsFailed = true;
        this.alertService.show('Failed to load authors', 'error');
      }
    });
  }

  pickRandomAuthors(): void {
    const shuffled = [...this.authors];
    for (let i = 0; i < Math.min(this.maxAuthors, shuffled.length); i++) {
      const randomIndex = i + Math.floor(Math.random() * (shuffled.length - i));
      [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
    }
    this.displayAuthors = shuffled.slice(0, this.maxAuthors);
  }

  trackBookById(_index: number, book: Book): number {
    return book.id;
  }

  trackAuthorByName(_index: number, author: { name: string }): string {
    return author.name;
  }

  addToCart(bookId: number) {
    this.cartService.add({ bookId, quantity: 1 }).subscribe({
      next: msg => this.alertService.show('Added to cart', 'success'),
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

}
