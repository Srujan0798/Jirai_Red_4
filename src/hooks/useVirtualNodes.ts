
import { useEffect, useState } from 'react';
import { useReactFlow, useViewport, Node } from 'reactflow';

export const useVirtualNodes = (allNodes: Node[]) => {
  const viewport = useViewport();
  const [visibleNodes, setVisibleNodes] = useState(allNodes);
  
  useEffect(() => {
    // If node count is low, skip virtualization to avoid flickering
    if (allNodes.length < 50) {
        setVisibleNodes(allNodes);
        return;
    }

    const { x, y, zoom } = viewport;
    // Buffer expands the viewport check to render nodes just outside the screen
    // Ensuring smooth panning
    const buffer = 600; 
    
    const visible = allNodes.filter(node => {
        // Calculate screen position
        const nodeX = node.position.x * zoom + x;
        const nodeY = node.position.y * zoom + y;
        
        // Basic bounding box check (assuming average node size ~300px)
        return (
            nodeX > -buffer &&
            nodeX < window.innerWidth + buffer &&
            nodeY > -buffer &&
            nodeY < window.innerHeight + buffer
        );
    });
    
    setVisibleNodes(visible);
  }, [viewport, allNodes]); // Re-run on zoom/pan or data change
  
  return visibleNodes;
};
