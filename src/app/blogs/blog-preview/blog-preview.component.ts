import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Blog, BlogService } from 'src/app/core/services/blog.service';

@Component({
  selector: 'app-blog-preview',
  standalone: true,
  imports: [CommonModule],
  providers: [BlogService],
  templateUrl: './blog-preview.component.html',
  styleUrls: ['./blog-preview.component.css']
})
export class BlogPreviewComponent implements OnInit {
  blogs: Blog[] = [];
  loading = true;
  loadFailed = false;

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.loadBlogs();
  }

  retry(): void {
    this.loading = true;
    this.loadFailed = false;
    this.loadBlogs();
  }

  trackByUrl(_index: number, blog: Blog): string {
    return blog.url;
  }

  private loadBlogs(): void {
    this.blogService.getLatest(4).subscribe({
      next: blogs => {
        this.blogs = blogs;
        this.loading = false;
      },
      error: () => {
        this.loadFailed = true;
        this.loading = false;
      }
    });
  }
}
