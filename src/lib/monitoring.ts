import * as Sentry from '@sentry/nextjs';

// Initialize Sentry
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: ['localhost', /^https:\/\/yourdomain\.com/],
    }),
    new Sentry.Replay(),
  ],
});

// Error tracking
export function trackError(error: Error, context?: Record<string, any>) {
  Sentry.captureException(error, {
    extra: context,
  });
}

// Performance monitoring
export function trackPerformance(metric: string, value: number) {
  Sentry.addBreadcrumb({
    category: 'performance',
    message: metric,
    data: { value },
    level: 'info',
  });
}

// User tracking
export function setUser(userId: string, userData?: Record<string, any>) {
  Sentry.setUser({
    id: userId,
    ...userData,
  });
}

// Transaction tracking
export function startTransaction(name: string, op: string) {
  return Sentry.startTransaction({
    name,
    op,
  });
}

// Custom event tracking
export function trackEvent(eventName: string, data?: Record<string, any>) {
  Sentry.captureMessage(eventName, {
    level: 'info',
    extra: data,
  });
}

// Profile update tracking
export function trackProfileUpdate(userId: string, updatedFields: string[]) {
  trackEvent('profile.updated', {
    userId,
    updatedFields,
  });
}

// Avatar update tracking
export function trackAvatarUpdate(userId: string, success: boolean) {
  trackEvent('avatar.updated', {
    userId,
    success,
  });
}

// API error tracking
export function trackApiError(endpoint: string, error: Error, statusCode?: number) {
  trackError(error, {
    endpoint,
    statusCode,
  });
}

// Performance metrics
export const performanceMetrics = {
  profileLoad: (duration: number) => trackPerformance('profile.load', duration),
  avatarUpload: (duration: number) => trackPerformance('avatar.upload', duration),
  profileUpdate: (duration: number) => trackPerformance('profile.update', duration),
};

// Error types
export const errorTypes = {
  validation: (error: Error) => trackError(error, { type: 'validation' }),
  network: (error: Error) => trackError(error, { type: 'network' }),
  auth: (error: Error) => trackError(error, { type: 'auth' }),
  storage: (error: Error) => trackError(error, { type: 'storage' }),
}; 