
export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, string | number | boolean>;
}

class Analytics {
  private enabled: boolean;
  private endpoint: string;

  constructor() {
    // Enable only in production and if user hasn't requested DNT
    this.enabled = (import.meta as any).env.PROD && !navigator.doNotTrack;
    this.endpoint = 'https://plausible.io/api/event'; // Example endpoint
  }

  track(event: AnalyticsEvent) {
    if (!this.enabled) {
        if ((import.meta as any).env.DEV) {
            console.log('[Analytics]', event.name, event.properties);
        }
        return;
    }

    // Send to analytics service (Mock implementation)
    // In a real app, you would use navigator.sendBeacon or fetch
    fetch(this.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: event.name,
        url: window.location.href,
        domain: window.location.hostname,
        props: event.properties,
      }),
    }).catch(err => console.warn('Analytics failed', err));
  }

  // --- Convenience Methods ---

  trackNodeCreated(type: string) {
    this.track({ name: 'node_created', properties: { type } });
  }

  trackViewModeChanged(mode: string) {
    this.track({ name: 'view_mode_changed', properties: { mode } });
  }

  trackAIQuery(success: boolean, model?: string) {
    this.track({ name: 'ai_query', properties: { success, model: model || 'unknown' } });
  }

  trackExport(format: string) {
    this.track({ name: 'export', properties: { format } });
  }

  trackError(error: string, context?: string) {
    this.track({ name: 'error', properties: { error, context } });
  }
}

export const analytics = new Analytics();
