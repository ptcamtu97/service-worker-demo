const webpush = require('web-push');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const vapidKeys = { 
  "publicKey": "BNlSomXdNs5yns7fqesraZ6_MwsnSYvJcUTuqLsiJ6hxLef4SJlcwAKa7BzTCiFZDnianl5RftzPdlZxSn7b1Q0", 
  "privateKey": "5PZ8-x2IQlZWUWCn96RPaAlCk6RaQE0DONnZqKpK1Vo" 
};

let USER_SUBSCRIPTIONS = [];

webpush.setVapidDetails(
  'mailto:example@yourdomain.org',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

const app = express();
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(cors());

app.route('/api/newsletter').post(sendNewsletter);
app.route('/api/notifications').post(addPushSubscriber);




function sendNewsletter(req, res) {
  console.log('Total subscriptions', USER_SUBSCRIPTIONS.length);

  const notificationPayload = {
    "notification": {
      "title": "Angular News",
      "body": "Hello",
      "icon": "assets/icons/cat.gif",
      "vibrate": [100, 50, 100],
      "data": {
        "dateOfArrival": Date.now(),
        "primaryKey": 1,
        "onActionClick": {
          "default": {
            "operation": "openWindow",
            "url": "https://www.google.com"
          }
        }
      }
    }
  };

  Promise.all(USER_SUBSCRIPTIONS.map(sub => webpush.sendNotification(
    sub, JSON.stringify(notificationPayload))))
    .then(() => res.status(200).json({ message: 'Newsletter sent successfully.' }))
    .catch(err => {
      console.error("Error sending notification, reason: ", err);
      res.sendStatus(500);
    });
}

function addPushSubscriber(req, res) {
  const sub = req.body;

  console.log('Received Subscription on the server: ', sub);

  USER_SUBSCRIPTIONS.push(sub);

  res.status(200).json({message: "Subscription added successfully."});
}


app.listen(3000, () => {
  console.log('server is listening on port 3000');
});