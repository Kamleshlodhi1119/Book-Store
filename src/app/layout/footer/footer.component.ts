import { Component, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertService } from 'src/app/core/services/alert.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {

  // Scroll-to-top visibility
  isVisible = false;

  // Subscribe form state
  subscriberEmail = '';
  isSubmitting = false;

  private API_URL = 'http://localhost:8080/api/subscribers';

  constructor(
    private http: HttpClient,
    private alertService: AlertService
  ) {}

  // Listen to window scroll events
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isVisible = window.scrollY > 300;
  }

  // Subscribe handler
  onSubscribe(): void {
    if (!this.isValidEmail(this.subscriberEmail)) {
      this.alertService.show('Please enter a valid email address', 'error');
      return;
    }

    this.isSubmitting = true;

    const payload = {
      email: this.subscriberEmail
    };

    this.http.post(this.API_URL, payload).subscribe({
      next: () => {
        this.alertService.show('🎉 Subscription successful!', 'success');
        this.subscriberEmail = '';
        this.isSubmitting = false;
      },
      error: (err) => {
        if (err.status === 409) {
          this.alertService.show('Email already subscribed', 'warning');
        } else {
          this.alertService.show('Subscription failed. Try again later.', 'error');
        }
        this.isSubmitting = false;
      }
    });
  }

  // Smooth scroll to top
  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  // Email validator
  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
