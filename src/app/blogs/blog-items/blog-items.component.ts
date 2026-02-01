import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Blog {
  title: string;
  description: string;
  image: string;
  url: string;
  published: string;
}

@Component({
  selector: 'app-blog-items',
  templateUrl: './blog-items.component.html',
  styleUrls: ['./blog-items.component.css']
})
export class BlogItemsComponent implements OnInit {

  private apiUrl =
    'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/tag/books';

  blogs: Blog[] = [];
  loading = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getBlogs().subscribe({
      next: data => {
        this.blogs = data;
        this.loading = false;
      },
      error: err => {
        console.error('Blog fetch failed:', err);
        this.loading = false;
      }
    });
  }

  getBlogs(): Observable<Blog[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(res => {
        if (!res || res.status !== 'ok' || !Array.isArray(res.items)) {
          console.error('Invalid API response:', res);
          return [];
        }

        return res.items.slice(0, 3).map((item: any) => ({
          title: item.title || 'Untitled',
          description: (item.description || '')
            .replace(/<[^>]*>/g, '')
            .slice(0, 120) + '...',
          image: item.thumbnail || 'assets/images/placeholder-blog.png',
          url: item.link,
          published: item.pubDate
            ? new Date(item.pubDate).toLocaleDateString()
            : 'Unknown'
        }));
      })
    );
  }

  openBlog(url: string) {
    window.open(url, '_blank');
  }
}
