import { Component } from '@angular/core';
import {
  SwPush,
  SwUpdate,
  UnrecoverableStateEvent,
  VersionEvent,
  VersionReadyEvent,
} from '@angular/service-worker';
import { DataService } from './services/data-service.service';
import { NewsletterService } from './services/newsletter.service';

// get VAPID
// npm install web-push -g
// web-push generate-vapid-keys --json
// use publicKey
// {"publicKey":"BNlSomXdNs5yns7fqesraZ6_MwsnSYvJcUTuqLsiJ6hxLef4SJlcwAKa7BzTCiFZDnianl5RftzPdlZxSn7b1Q0","privateKey":"5PZ8-x2IQlZWUWCn96RPaAlCk6RaQE0DONnZqKpK1Vo"}

export const PUBLIC_VAPID_KEY_OF_SERVER =
  'BNlSomXdNs5yns7fqesraZ6_MwsnSYvJcUTuqLsiJ6hxLef4SJlcwAKa7BzTCiFZDnianl5RftzPdlZxSn7b1Q0';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'service-worker-demo';
  result: any;

  constructor(
    private updatesSw: SwUpdate,
    private swPush: SwPush,
    private dataService: DataService,
    private newsletterService: NewsletterService
  ) {}

  ngOnInit(): void {
    this.dataService.getData().then((result) => {
      result.subscribe((value) => {
        this.result = value.slice(0, 10);
      });
    });
    console.log(123)

    // console.log('AppComponent.ngOnInit');
    // if (!this.updatesSw.isEnabled) {
    //   console.log('AppComponent.ngOnInit: Service Worker is not enabled');
    //   return;
    // }
    // console.log('AppComponent.ngOnInit: Service Worker is enabled');
    // this.handleUpdates();
  }

  clearCache() {
    caches.keys().then(function (names) {
      for (let name of names) caches.delete(name);
    });
  }

  unsubscribe() {
    this.swPush.unsubscribe().then(() => {
      console.log('Unsubscribed');
    });
  }

  handleUpdates() {
    this.updatesSw.versionUpdates.subscribe((event: VersionEvent) => {
      console.log(event);
      alert(event.type);
      if (
        event.type === 'VERSION_READY' &&
        confirm(
          `New version ${
            (event as VersionReadyEvent).latestVersion.hash
          } available. Load New Version?`
        )
      ) {
        window.location.reload();
      }
    });
    // const interval = setInterval(async () => {
    //   const shouldUpdate = await this.updatesSw.checkForUpdate();
    //   alert('Checked for update with result: ' + shouldUpdate);
    //   if (shouldUpdate) {
    //     const result = await this.updatesSw.activateUpdate();
    //     alert('Activate Update completed with result: ' + result);
    //     clearInterval(interval);
    //   }
    // }, 1000);

    this.updatesSw.unrecoverable.subscribe((event: UnrecoverableStateEvent) => {
      alert('Error reason : ' + event.reason);
    });
  }


  subscribeToNotifications() {
    this.swPush
      .requestSubscription({
        serverPublicKey: PUBLIC_VAPID_KEY_OF_SERVER,
      })
      .then((sub) => {
        console.log('Notification Subscription: ', sub);

        this.newsletterService.addPushSubscriber(sub).subscribe(
          () => console.log('Sent push subscription object to server.'),
          (err) =>
            console.log(
              'Could not send subscription object to server, reason: ',
              err
            )
        );
      })
      .catch((err) =>
        console.error('Could not subscribe to notifications', err)
      );
  }

  sendNewsletter() {
    console.log('Sending Newsletter to all Subscribers ...');
    this.newsletterService.send().subscribe();
  }
}
