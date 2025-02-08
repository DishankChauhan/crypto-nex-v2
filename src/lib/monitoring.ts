import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

export const initMonitoring = () => {
  if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [new BrowserTracing()],
      tracesSampleRate: 0.2,
      environment: import.meta.env.MODE
    });
  }
};

export const logError = (error: Error, context?: Record<string, any>) => {
  console.error(error);
  if (import.meta.env.PROD) {
    Sentry.captureException(error, { extra: context });
  }
};

export const logEvent = (name: string, data?: Record<string, any>) => {
  if (import.meta.env.PROD) {
    Sentry.captureMessage(name, {
      level: 'info',
      extra: data
    });
  }
};