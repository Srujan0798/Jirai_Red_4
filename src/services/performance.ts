
import { logInfo } from './monitoring';

// Web Vitals Stub
// import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals';

export function initPerformanceMonitoring() {
  // if (import.meta.env.PROD) {
  //   onCLS(logMetric);
  //   onFID(logMetric);
  //   onFCP(logMetric);
  //   onLCP(logMetric);
  //   onTTFB(logMetric);
  // }
}

function logMetric(metric: any) {
  // console.debug('[Web Vital]', metric.name, metric.value);
  // Send to analytics
}

export function measureRenderTime(componentName: string) {
  const start = performance.now();
  
  return () => {
    const end = performance.now();
    const duration = end - start;
    
    if (duration > 100) {
      console.warn(`[Perf] Slow render: ${componentName} took ${duration.toFixed(2)}ms`);
      logInfo('slow_render', { component: componentName, duration });
    }
  };
}

export function measureAPICall(endpoint: string) {
  const start = performance.now();
  
  return (success: boolean) => {
    const duration = performance.now() - start;
    if (duration > 1000) {
       console.warn(`[Perf] Slow API call: ${endpoint} took ${duration.toFixed(2)}ms`);
    }
    logInfo('api_call', { endpoint, duration, success });
  };
}