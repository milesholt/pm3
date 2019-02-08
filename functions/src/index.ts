import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as tools from 'firebase-tools';

admin.initializeApp();

exports.newItemNotificationDevice = functions.firestore
    .document('projects/{id}')
    .onCreate(async event => {

    const data = event.data();
    const userId = data.uid;

    // Notification content
    const device_notification = {
      notification: {
          title: 'New Item',
          body: `${userId} added a new item.`,
          icon: 'https://goo.gl/Fz9nrQ'
      }
    }

    // ref to the device collection for the user
    const db = admin.firestore()
    const tokensRef = db.collection('tokens').where('userId', '==', userId)

    // get the user's tokens and send notifications
    const tokensRes = await tokensRef.get();
    const tokens = [];

    // send a notification to each device token
    tokensRes.forEach(result => {
      const token = result.data().token;
      tokens.push(token)
    })

    return admin.messaging().sendToDevice(tokens, device_notification)

});

exports.newItemNotificationWeb = functions.firestore
    .document('projects/{id}')
    .onCreate(async snapshot => {

    const data = snapshot.data();
    const userId = data.uid;

    // ref to the device collection for the user
    const db = admin.firestore()
    const tokensRef = db.collection('tokens').where('userId', '==', userId).where('type', '==', 'webapp')

    // get the user's tokens and send notifications
    const tokensRes = await tokensRef.get();
    const tokens = [];

    // send a notification to each device token
    tokensRes.forEach(result => {
      const token = result.data().token;
      tokens.push(token)
    })

    //get the last token from array, as this will be the latest (valid) token from that user.
    const validtoken = tokens[(tokens.length-1)];

    const web_notification = {
      data: {
          title: 'New Item',
          body: `${userId} added a new item.`
      },
      token: validtoken
    }

    console.log(validtoken);

    return admin.messaging().send(web_notification)

});


/**
 * Initiate a recursive delete of documents at a given path.
 *
 * The calling user must be authenticated and have the custom "admin" attribute
 * set to true on the auth token.
 *
 * This delete is NOT an atomic operation and it's possible
 * that it may fail after only deleting some documents.
 *
 * @param {string} data.path the document or collection path to delete.
 */
exports.recursiveDelete = functions
  .runWith({
    timeoutSeconds: 540,
    memory: '2GB'
  })
  .https.onCall((data, context) => {

    //TODO: This user should require an auth token
    // Only allow admin users to execute this function.
    // if (!(context.auth && context.auth.token && context.auth.token.admin)) {
    //   throw new functions.https.HttpsError(
    //     'permission-denied',
    //     'Must be an administrative user to initiate delete.'
    //   );
    // }

    const path = data.path;
    console.log(
      `User ${context.auth.uid} has requested to delete path ${path}`
    );

    // Run a recursive delete on the given document or collection path.
    // The 'token' must be set in the functions config, and can be generated
    // at the command line by running 'firebase login:ci'.
    return tools.firestore
      .delete(path, {
        project: process.env.GCLOUD_PROJECT,
        recursive: true,
        yes: true,
        token: '1/iB87UP5VT0vrLL9Re49E7v5w3PNNSrB-3f5ZHAMYYhc'
        //token: functions.config().fb.token //TODO: This isn't working for some reason
      })
      .then(() => {
        return {
          path: path
        };
      });
  });




// exports.newItemNotificationNew = functions.firestore
//     .document('projects/{id}')
//     .onCreate(async snapshot => {
//
//     const data = snapshot.data();
//     const userId = data.uid;
//
//     // ref to the device collection for the user
//     const db = admin.firestore()
//     const tokensRef = db.collection('tokens').where('userId', '==', userId)
//
//     // get the user's tokens and send notifications
//     const tokensRes = await tokensRef.get();
//     const device_tokens = [];
//     const web_tokens = [];
//
//     // send a notification to each device token
//     tokensRes.forEach(result => {
//       const token = result.data().token;
//       const type = result.data().type;
//       type === 'webapp' ? web_tokens.push(token) : device_tokens.push(token)
//       //tokens.push(token)
//     })
//
//     //get the last token from array, as this will be the latest (valid) token from that user.
//     const valid_webtoken = web_tokens[(web_tokens.length-1)];
//
//     const web_notification = {
//       data: {
//           title: 'New Item',
//           body: `${userId} added a new item.`
//       },
//       token: valid_webtoken
//     }
//
//     const device_notification = {
//       notification: {
//           title: 'New Item',
//           body: `${userId} added a new item.`,
//           icon: 'https://goo.gl/Fz9nrQ'
//       }
//     }
//
//     console.log(valid_webtoken);
//
//     admin.messaging().sendToDevice(device_tokens, device_notification);
//     //admin.messaging().send(web_notification)
//
//     return admin.messaging().send(web_notification)
//
// });
