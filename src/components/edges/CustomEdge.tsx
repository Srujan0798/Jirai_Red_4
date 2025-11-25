
import React from 'react';
import { EdgeProps, getBezierPath, EdgeLabelRenderer } from 'reactflow';
import { useStore } from '../../store';
import { X } from 'lucide-react';

export const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) => {
  const deleteEdge = useStore((state) => state.deleteEdge);

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <div className="group">
      {/* Visible Path */}
      <path
        id={id}
        style={style}
        className="react-flow__edge-path transition-all duration-300 group-hover:stroke-[#FF4F5E] group-hover:stroke-[2px] group-hover:opacity-100"
        d={edgePath}
        markerEnd={markerEnd}
      />
      
      {/* Invisible Interaction Path (Wider hit area) */}
      <path
        d={edgePath}
        style={{ strokeWidth: 20, stroke: 'transparent', fill: 'none', cursor: 'pointer' }}
        className="react-flow__edge-path-interaction"
      />

      {/* Edge Label with Delete Button */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <button
            className="w-6 h-6 bg-[#181B21] border border-[#2D313A] rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#FF4F5E] hover:border-[#FF4F5E] shadow-lg transition-all scale-90 hover:scale-110 z-50"
            onClick={(e) => {
              e.stopPropagation();
              deleteEdge(id);
            }}
            aria-label="Delete Connection"
            title="Delete Connection"
          >
            <X size={12} />
          </button>
        </div>
      </EdgeLabelRenderer>
    </div>
  );
};
