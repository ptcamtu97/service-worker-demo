import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ServiceWorkerModule, SwUpdate } from '@angular/service-worker';
import { DataService } from './services/data-service.service';
import { HttpClientModule } from '@angular/common/http';
import { NewsletterService } from './services/newsletter.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: true
    })
  ],
  providers: [DataService, NewsletterService],
  bootstrap: [AppComponent]
})

export class AppModule {
  // SwUpdate: check update of service worker
  // constructor(private swUpdate: SwUpdate) {
  //   if (this.swUpdate.isEnabled) {
  //     this.swUpdate.available.subscribe(() => {
  //       if (confirm('New version available. Load new version?')) {
  //         window.location.reload();
  //       }
  //     });
  //   }
  // }
}
