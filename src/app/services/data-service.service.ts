import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private cacheName = 'my-cache';

  constructor(private http: HttpClient) {}

  async getData(): Promise<Observable<any[]>> {
    const url = 'http://jsonplaceholder.typicode.com/posts';

    if ('caches' in window) {
      const response = await caches.match(url);
      if (response) {
        return of(await response.json());
      } else {
        return this.fetchAndCache(url);
      }
    } else {
      return this.http.get<any[]>(url);
    }
  }

  private fetchAndCache(url: string): Observable<any[]> {
    return this.http.get<any[]>(url).pipe(
      map((data) => {
        if ('caches' in window) {
          caches.open(this.cacheName).then((cache) => {
            cache.put(url, new Response(JSON.stringify(data)));
          });
        }
        return data;
      })
    );
  }
}
