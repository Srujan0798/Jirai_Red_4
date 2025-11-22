
import React from 'react';

// === 1. Loading Spinner ===
export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  text?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = '#FF4F5E',
  text,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-[3px]',
    lg: 'w-12 h-12 border-4'
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div
        className={`
          ${sizeClasses[size]}
          rounded-full
          animate-spin
        `}
        style={{ 
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderTopColor: color,
            borderRightColor: color // Added for a cooler 3/4 spin look
        }}
        role="status"
        aria-label="loading"
      />
      {text && (
        <span className="text-xs text-gray-400 font-mono animate-pulse tracking-wider uppercase">
          {text}
        </span>
      )}
    </div>
  );
};

// === 2. Loading Overlay ===
export interface LoadingOverlayProps {
    message?: string;
    show: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message = 'Loading...', show }) => {
    if (!show) return null;
    
    return (
        <div className="fixed inset-0 z-[9999] bg-[#0F1115]/90 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300">
            <div className="bg-[#181B21] border border-[#2D313A] p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-4 min-w-[200px] transform scale-100">
                <LoadingSpinner size="lg" text={message} />
            </div>
        </div>
    );
};

// === 3. Skeleton Loader ===
export interface SkeletonLoaderProps {
    width?: string | number;
    height?: string | number;
    borderRadius?: string;
    className?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
    width = '100%',
    height = '20px',
    borderRadius = '0.5rem', // rounded-lg
    className = ''
}) => {
    return (
        <div 
            className={`bg-[#2D313A]/50 animate-pulse ${className}`}
            style={{ width, height, borderRadius }}
        />
    );
};
