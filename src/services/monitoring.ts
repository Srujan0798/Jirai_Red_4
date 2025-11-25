import React from 'react';

// In a real app, you would import * as Sentry from '@sentry/react'

export function initMonitoring() {
  // Cast import.meta to any to avoid type errors if vite types are missing
  const env = (import.meta as any).env;
  const dsn = env.VITE_SENTRY_DSN;
  
  if (env.PROD && dsn) {
    console.log('Initializing Sentry with DSN:', dsn);
    // Sentry.init({
    //   dsn,
    //   environment: env.MODE,
    //   release: `jirai@${env.VITE_APP_VERSION}`,
    //   tracesSampleRate: 0.1,
    //   replaysSessionSampleRate: 0.1,
    //   replaysOnErrorSampleRate: 1.0,
    // });
  }
}

export function logError(error: Error, context?: Record<string, any>) {
  console.error('[Jirai Error]', error);
  if ((import.meta as any).env.PROD) {
    // Sentry.captureException(error, { extra: context });
  }
}

export function logInfo(message: string, context?: Record<string, any>) {
  console.log('[Jirai Info]', message, context);
  if ((import.meta as any).env.PROD) {
    // Sentry.captureMessage(message, { level: 'info', extra: context });
  }
}