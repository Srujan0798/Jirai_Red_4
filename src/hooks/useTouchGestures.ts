
import { useGesture } from '@use-gesture/react';
import { useReactFlow } from 'reactflow';
import { useRef } from 'react';

export const useTouchGestures = (ref: React.RefObject<HTMLDivElement>) => {
  const { setViewport, getViewport } = useReactFlow();
  
  // We use a ref to avoid stale closures in the gesture callbacks
  const viewportRef = useRef(getViewport());
  
  const bind = useGesture({
    onPinch: ({ offset: [d], memo }) => {
        // Simple pinch to zoom mapping
        // offset is accumulated distance
        const startZoom = memo || getViewport().zoom;
        // Map gesture distance to zoom scale (simplified)
        // In a production app, you'd calculate the center point of the pinch
        return startZoom;
    },
    // React Flow handles basic touch panning natively well, 
    // but this hook allows for custom multi-touch logic if needed.
  }, {
      target: ref,
      eventOptions: { passive: false }
  });
  
  return bind;
};
