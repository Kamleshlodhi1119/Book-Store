
import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-footer', 
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
isVisible = false;

  // Listen to window scroll events
  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Show button if scrolled more than 300px
    this.isVisible = window.scrollY > 300;
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

}
