import { AfterViewInit, Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-allapis',
  templateUrl: './allapis.component.html',
  styleUrls: ['./allapis.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AllapisComponent implements AfterViewInit, OnDestroy {

  constructor(private location: Location) {}


  
  ngAfterViewInit(): void {
    this.loadRedoc();
  }

  ngOnDestroy(): void {
    // 👇 Remove #tag/... from URL when leaving docs
    this.location.replaceState(this.location.path(false));
  }

  private loadRedoc() {
    if ((window as any).Redoc) {
      this.renderDocs();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js';
    script.onload = () => this.renderDocs();
    document.body.appendChild(script);
  }

  private renderDocs() {
    (window as any).Redoc.init(
      'https://bookstore-h5qp.onrender.com/v3/api-docs',
      {
        scrollYOffset: 60,
        theme: {
          colors: {
            primary: {
              main: '#1976d2'
            }
          }
        }
      },
      document.getElementById('redoc-container')
    );
  }

  
}
