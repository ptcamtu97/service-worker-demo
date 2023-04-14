import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class NewsletterService {
  constructor(private http: HttpClient) {}

  // update subscription key 
  // send -> compare subscription key (server) -> notification
  addPushSubscriber(sub: any) {
    return this.http.post('http://localhost:3000/api/notifications', sub);
  }

  send() {
    return this.http.post('http://localhost:3000/api/newsletter', null);
  }
}
