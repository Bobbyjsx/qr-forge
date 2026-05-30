// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a user loads the browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://4ed3f01ed82c235a6379660298e17fef@o4511248614096896.ingest.us.sentry.io/4511476014186496",

  integrations: [
    Sentry.replayIntegration(),
  ],

  // Session Replay
  replaysSessionSampleRate: 1.0, // Set to 1.0 for testing, lower for production
  replaysOnErrorSampleRate: 1.0,

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
