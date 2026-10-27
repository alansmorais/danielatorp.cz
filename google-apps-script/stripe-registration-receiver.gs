/**
 * Daniela Torp — Stripe paid-registration receiver.
 *
 * Deploy as a separate Google Apps Script web app.
 * Script Properties required:
 *   SPREADSHEET_ID = ID of the Google Sheet to store registrations
 *   STRIPE_REGISTRATION_SHARED_SECRET = same random secret as Cloudflare Worker
 *
 * Deploy > New deployment > Web app > Execute as: Me.
 * Access must allow the Worker to reach the URL; the shared bearer secret is
 * checked on every request. Never use the existing contact-form script URL.
 */

function doPost(e) {
  try {
    var expected = PropertiesService.getScriptProperties().getProperty('STRIPE_REGISTRATION_SHARED_SECRET');
    var authorization = e && e.parameter && e.parameter.authorization;
    // Apps Script web apps do not reliably expose arbitrary Authorization headers
    // through e, so the Worker sends the shared secret as a JSON field as well.
    var body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (!expected || body.shared_secret !== expected) {
      return jsonResponse({ ok: false, error: 'Unauthorized' });
    }

    if (body.type !== 'workshop_registration_paid' || !body.stripe_event_id) {
      return jsonResponse({ ok: false, error: 'Unsupported event' });
    }

    var metadata = body.metadata || {};
    var workshopId = String(metadata.workshop_id || '');
    var email = String(body.customer_email || metadata.participant_email || '').trim();
    if (!workshopId || !email || body.payment_status !== 'paid') {
      return jsonResponse({ ok: false, error: 'Missing verified paid registration data' });
    }

    var spreadsheetId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
    if (!spreadsheetId) return jsonResponse({ ok: false, error: 'SPREADSHEET_ID is not configured' });

    var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    var sheet = spreadsheet.getSheetByName('Registrations') || spreadsheet.insertSheet('Registrations');
    var headers = [
      'Stripe Event ID', 'Checkout Session ID', 'Payment Intent ID', 'Payment Status',
      'Workshop ID', 'Workshop Title', 'Participant Name', 'Participant Email',
      'Amount (minor units)', 'Currency', 'Paid At', 'Recorded At',
      'Registration Source', 'Source Website', 'Site Language'
    ];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
    } else {
      // Extend existing Registrations sheets without disturbing their existing rows.
      var existingHeaders = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0].map(String);
      headers.forEach(function(header) {
        if (existingHeaders.indexOf(header) === -1) {
          sheet.getRange(1, sheet.getLastColumn() + 1).setValue(header);
          existingHeaders.push(header);
        }
      });
    }

    // Serialize duplicate checks so Stripe webhook retries cannot create duplicate rows.
    var lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      var lastRow = sheet.getLastRow();
      if (lastRow > 1) {
        var existingIds = sheet.getRange(2, 1, lastRow - 1, 1).getValues().flat();
        if (existingIds.indexOf(body.stripe_event_id) !== -1) {
          return jsonResponse({ ok: true, duplicate: true });
        }
      }
      sheet.appendRow([
        body.stripe_event_id,
        body.checkout_session_id || '',
        body.payment_intent_id || '',
        'paid',
        workshopId,
        String(metadata.workshop_title || ''),
        String(body.customer_name || metadata.participant_name || ''),
        email,
        Number(body.amount_total || 0),
        String(body.currency || '').toUpperCase(),
        body.paid_at || new Date().toISOString(),
        new Date().toISOString(),
        String(body.registration_source || metadata.registration_source || 'DanielaTorp.no'),
        String(body.source_website || metadata.source_website || metadata.site_url || ''),
        String(body.site_language || metadata.site_language || 'NO')
      ]);
    } finally {
      lock.releaseLock();
    }

    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err && err.message || err) });
  }
}

function jsonResponse(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
