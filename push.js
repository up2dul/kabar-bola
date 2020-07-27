const webPush = require('web-push');

const vapidKeys = {
  publicKey: 'BAxdKyfsmR1u9vbB79ia1BR8RqSjZCcriuj0AJ2CNCZUPRxfVYbi6oX9YP0LH4QnKTwFS6-9rm_TFLAJN--jGuQ',
  privateKey: '5o_61FXArfl1J-GTnsfY7YSy62-r2JSBFCiLi44ucTE',
};

webPush.setVapidDetails(
  'mailto:malik301002@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

const pushSubscription = {
  endpoint: 'https://fcm.googleapis.com/fcm/send/cR0Vxlnv7vY:APA91bHiG93LmauO6J6LFuX3hkS5JUytiLkdzUpLiyVRBOlpD2cDoxADzTXGM77-kLNiyCiqN6rcPETGgCo7gyMqVNsw3Sm12_X28DRQPgA421X0S6Fe1Eqmb-moV1gM_lECmKLW67WV',
  keys: {
    p256dh: 'BN7q9w0U3rt+jXJjaP1HZtvTEZHZv9G+Co5/pWP1Tf4iIUb8sUbRxQ01I3dNHsQjK/1RyesNBKMBV0MnMhtu+KQ=',
    auth: 'rp8Y/1al0Ij2KLBobRHCSA==',
  },
};

const payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';

const options = {
  gcmAPIKey: '12414909878',
  TTL: 60,
};
webPush.sendNotification(pushSubscription, payload, options);
