// OPTIONAL — email the admin team whenever a learner submits a support request.
// Not deployed or tested here. Add to your existing Cloud Functions project (functions/index.js)
// and install the "Trigger Email from Firestore" extension (it watches the `mail` collection).
const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const admin = require('firebase-admin');

exports.notifyAdminOfSupportRequest = onDocumentCreated('supportRequests/{id}', async (event) => {
  const r = event.data.data();
  const admins = await admin.firestore().collection('admins').get();
  const to = admins.docs.map((d) => d.id);
  if (!to.length) return;
  await admin.firestore().collection('mail').add({
    to,
    message: {
      subject: `New support request from ${r.name || r.email}`,
      text: `${r.category}\n\n${r.message}\n\nFrom: ${r.email}\nModules done: ${r.progress}/9\n\nOpen the admin page to reply.`,
    },
  });
});
