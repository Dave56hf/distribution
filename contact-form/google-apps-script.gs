/**
 * RootFlow contact form -> Gmail
 *
 * SETUP (about 3 minutes, done once while signed in as rootflowglobal@gmail.com)
 * 1. Go to https://script.google.com and click "New project".
 * 2. Delete the sample code, paste in this whole file, and click Save.
 * 3. Click Deploy > New deployment > the gear icon > "Web app".
 *      Execute as:      Me (rootflowglobal@gmail.com)
 *      Who has access:  Anyone
 *    Click Deploy and approve the permissions when Google asks
 *    (Advanced > "Go to project" > Allow). It needs permission to send email.
 * 4. Copy the "Web app URL" (it ends in /exec) and paste it into
 *    GOOGLE_SCRIPT_URL at the top of app.js in the website code.
 *
 * If you ever edit this script, use Deploy > Manage deployments > Edit >
 * "New version" so the live URL picks up the change.
 */

const TO_EMAIL = 'rootflowglobal@gmail.com';

function doPost(e) {
  try {
    const p = (e && e.parameter) || {};

    // Hidden trap field: real visitors leave it empty, spam bots fill it in
    if (p._honey) return reply({ success: true });

    const clean = (value, max) => String(value || '').trim().slice(0, max);
    const name = clean(p.name, 120);
    const email = clean(p.email, 160);
    const phone = clean(p.phone, 60);
    const organisation = clean(p.organisation, 160);
    const country = clean(p.country, 80);
    const message = clean(p.message, 5000);

    if (!name || !email || !message) {
      return reply({ success: false, message: 'Missing required fields' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return reply({ success: false, message: 'Invalid email address' });
    }

    const rows = [
      ['Name', name],
      ['Email', email],
      ['Phone', phone || '-'],
      ['Organisation', organisation || '-'],
      ['Country', country || '-'],
      ['Message', message],
    ];

    const text = rows.map((r) => r[0] + ': ' + r[1]).join('\n');
    const html =
      '<h2>New website enquiry</h2><table cellpadding="8" style="border-collapse:collapse">' +
      rows
        .map(
          (r) =>
            '<tr><td style="border:1px solid #ddd"><b>' + esc(r[0]) + '</b></td>' +
            '<td style="border:1px solid #ddd">' + esc(r[1]).replace(/\n/g, '<br>') + '</td></tr>'
        )
        .join('') +
      '</table>';

    MailApp.sendEmail({
      to: TO_EMAIL,
      replyTo: email,
      subject: 'New website enquiry from ' + name,
      body: text,
      htmlBody: html,
      name: 'RootFlow Website',
    });

    return reply({ success: true });
  } catch (error) {
    return reply({ success: false, message: String(error) });
  }
}

// Opening the URL in a browser is a quick way to check the deployment is live
function doGet() {
  return reply({ success: true, message: 'RootFlow contact form is live' });
}

function reply(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}

function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
