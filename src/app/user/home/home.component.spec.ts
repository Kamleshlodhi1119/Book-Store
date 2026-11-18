import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AlertService } from 'src/app/core/services/alert.service';
import { BookService } from 'src/app/core/services/book.service';
import { CartService } from 'src/app/core/services/cart.service';
import { WishlistService } from 'src/app/core/services/wishlist.service';
import { UserHomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: UserHomeComponent;
  let fixture: ComponentFixture<UserHomeComponent>;
  let bookService: jasmine.SpyObj<BookService>;

  beforeEach(async () => {
    bookService = jasmine.createSpyObj<BookService>('BookService', ['getAll', 'getAuthors']);
    bookService.getAll.and.returnValue(of([]));
    bookService.getAuthors.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [UserHomeComponent],
      imports: [CommonModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: BookService, useValue: bookService },
        { provide: CartService, useValue: jasmine.createSpyObj('CartService', ['add']) },
        { provide: WishlistService, useValue: jasmine.createSpyObj('WishlistService', ['add']) },
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) },
        { provide: AlertService, useValue: jasmine.createSpyObj('AlertService', ['show']) }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads the book and author collections', () => {
    expect(bookService.getAll).toHaveBeenCalled();
    expect(bookService.getAuthors).toHaveBeenCalled();
    expect(component.booksLoading).toBeFalse();
    expect(component.authorsLoading).toBeFalse();
  });

  it('uses a readable fallback when the book description contains a raw template expression', () => {
    component.bookOfTheDay = {
      id: 1,
      title: 'Test Book',
      authorName: 'Test Author',
      price: 10,
      isbn: 'test-isbn',
      imageUrl: '',
      stockQuantity: 1,
      description: "{{ bookOfTheDay.description || 'A compelling read chosen for today.' }}"
    };

    expect(component.bookOfTheDayDescription).toBe('A compelling read chosen for today’s reading list.');
  });

  it('shows a valid book description', () => {
    component.bookOfTheDay = {
      id: 1,
      title: 'Test Book',
      authorName: 'Test Author',
      price: 10,
      isbn: 'test-isbn',
      imageUrl: '',
      stockQuantity: 1,
      description: '  A story worth reading.  '
    };

    expect(component.bookOfTheDayDescription).toBe('A story worth reading.');
  });
});
