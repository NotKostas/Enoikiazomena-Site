// netlify/functions/ical.js
// Proxy για τα Booking.com iCal feeds - λύνει το CORS πρόβλημα

const ICAL_URLS = {
  '1': 'https://ical.booking.com/v1/export?t=73edf593-5d94-458b-b0ed-ffa8e45a265b',
  '2': 'https://ical.booking.com/v1/export?t=4ae257ef-ea82-48d0-aff7-f271d0d60672',
  '3': 'https://ical.booking.com/v1/export?t=75802dde-b71e-4376-9c07-9b8406f60179'
};

exports.handler = async (event) => {
  const room = event.queryStringParameters?.room;

  if (!room || !ICAL_URLS[room]) {
    return {
      statusCode: 400,
      body: 'Invalid room parameter. Use ?room=1, ?room=2, or ?room=3'
    };
  }

  try {
    const response = await fetch(ICAL_URLS[room]);

    if (!response.ok) {
      return {
        statusCode: 502,
        body: 'Failed to fetch calendar from Booking.com'
      };
    }

    const icalText = await response.text();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600' // cache 1 hour
      },
      body: icalText
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: 'Server error: ' + err.message
    };
  }
};
