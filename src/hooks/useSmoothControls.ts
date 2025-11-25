
import { useEffect } from 'react';
import { useReactFlow } from 'reactflow';

export const useSmoothControls = () => {
  const { setViewport, getViewport, zoomIn, zoomOut } = useReactFlow();
  
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      const panAmount = 50;
      const current = getViewport();

      // Smooth arrow key panning
      if (e.key === 'ArrowUp') {
        setViewport({ ...current, y: current.y + panAmount }, { duration: 200 });
      }
      if (e.key === 'ArrowDown') {
        setViewport({ ...current, y: current.y - panAmount }, { duration: 200 });
      }
      if (e.key === 'ArrowLeft') {
        setViewport({ ...current, x: current.x + panAmount }, { duration: 200 });
      }
      if (e.key === 'ArrowRight') {
        setViewport({ ...current, x: current.x - panAmount }, { duration: 200 });
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [setViewport, getViewport]);
};
