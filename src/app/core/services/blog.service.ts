import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

export interface Blog {
  title: string;
  description: string;
  image: string;
  url: string;
  published: string;
}

interface FeedItem {
  title?: string;
  description?: string;
  thumbnail?: string;
  link?: string;
  pubDate?: string;
}

interface FeedResponse {
  status: string;
  items: FeedItem[];
}

@Injectable()
export class BlogService {
  private readonly apiUrl =
    'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/tag/books';

  constructor(private http: HttpClient) {}

  getLatest(limit = 4): Observable<Blog[]> {
    return this.http.get<FeedResponse>(this.apiUrl).pipe(
      map(response => {
        if (!response || response.status !== 'ok' || !Array.isArray(response.items)) {
          throw new Error('The blog feed returned an invalid response.');
        }

        return response.items
          .map(item => {
            const url = this.secureUrl(item.link);
            if (!url) return null;

            const description = (item.description || '')
              .replace(/<[^>]*>/g, ' ')
              .replace(/\s+/g, ' ')
              .trim();
            const publishedDate = item.pubDate ? Date.parse(item.pubDate) : NaN;

            return {
              title: item.title || 'Untitled',
              description: description.length > 140
                ? `${description.slice(0, 140).trimEnd()}...`
                : description,
              image: this.secureUrl(item.thumbnail) || 'assets/images/placeholder-blog.png',
              url,
              published: Number.isNaN(publishedDate)
                ? 'Unknown'
                : new Date(publishedDate).toLocaleDateString()
            };
          })
          .filter((blog): blog is Blog => blog !== null)
          .slice(0, limit);
      })
    );
  }

  private secureUrl(value?: string): string {
    try {
      const url = new URL(value || '');
      return url.protocol === 'https:' ? url.href : '';
    } catch {
      return '';
    }
  }
}
