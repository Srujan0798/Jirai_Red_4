
import React, { useState, useEffect, useMemo } from 'react';
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { STORAGE_KEYS } from '../constants';

const STEPS = [
  {
    title: "Welcome to Jirai!",
    description: "Your new AI-powered spatial intelligence workspace. Let's take a quick tour.",
    target: null,
  },
  {
    title: "Create Your First Node",
    description: "To start, double-click anywhere on the canvas to create a new topic node.",
    target: "#main-canvas",
  },
  {
    title: "Edit Node Details",
    description: "Double-click any node to open the details panel. Here you can change its title, add notes, and adjust its style.",
    target: ".react-flow__node",
  },
  {
    title: "Connect Nodes",
    description: "Create relationships by clicking and dragging from the edge of one node to another.",
    target: ".react-flow__handle",
  },
  {
    title: "Try the AI Assistant",
    description: "Use the prompt bar below to ask the AI to generate complex mind maps, project plans, or research topics instantly.",
    target: "#assistant-input",
  },
  {
    title: "Explore View Modes",
    description: "Switch between Analysis (Mind Map), Management (Timeline), and Workflow (Calendar) views using the sidebar.",
    target: "#sidebar-nav",
  },
  {
    title: "You're All Set!",
    description: "You've learned the basics. Remember to right-click on nodes for more options. Now, start building your workspace!",
    target: null,
  }
];

const getTargetRect = (selector: string | null): DOMRect | null => {
  if (!selector) return null;
  // A small delay to allow the DOM to update, especially for dynamic elements
  const element = document.querySelector(selector);
  return element ? element.getBoundingClientRect() : null;
};

export const OnboardingTutorial: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [popoverStyle, setPopoverStyle] = useState<React.CSSProperties>({});
  const [showDontShowAgain, setShowDontShowAgain] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem(STORAGE_KEYS.TUTORIAL_COMPLETED);
    if (!completed) {
      // Delay start to allow UI to render fully
      setTimeout(() => setIsVisible(true), 1500);
    }
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const step = STEPS[currentStep];
    const rect = getTargetRect(step.target);

    let style: React.CSSProperties = {
        position: 'absolute',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: 'transform, top, left'
    };

    if (rect) {
      let top = rect.bottom + 15;
      let left = rect.left + rect.width / 2;
      let transform = 'translateX(-50%)';

      // Adjust if popover goes off-screen
      if (top + 250 > window.innerHeight) { // 250 is approx popover height
          top = rect.top - 15;
          transform = 'translateX(-50%) translateY(-100%)';
      }
      if (left + 192 > window.innerWidth) { // 384 / 2
          left = window.innerWidth - 192 - 16;
      }
      if (left - 192 < 0) {
          left = 192 + 16;
      }

      style = { ...style, top: `${top}px`, left: `${left}px`, transform };
    } else {
      // Center on screen
      style = { ...style, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }
    
    setPopoverStyle(style);
  }, [currentStep, isVisible]);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };
  
  const handlePrev = () => {
      if (currentStep > 0) {
          setCurrentStep(prev => prev - 1);
      }
  }

  const handleComplete = (skip = false) => {
    if (skip || showDontShowAgain) {
      localStorage.setItem(STORAGE_KEYS.TUTORIAL_COMPLETED, 'true');
    }
    setIsVisible(false);
  };
  
  const step = STEPS[currentStep];
  const targetRect = useMemo(() => getTargetRect(step.target), [currentStep, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[999] pointer-events-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm pointer-events-auto transition-opacity duration-300 animate-in fade-in" 
        onClick={() => handleComplete(true)}
      />
      
      {/* Spotlight Effect */}
      {targetRect && (
          <div
              className="absolute pointer-events-none border-2 border-dashed border-[#FF4F5E] rounded-lg shadow-[0_0_40px_10px_rgba(255,79,94,0.25)] transition-all duration-400 ease-in-out animate-pulse"
              style={{
                  top: targetRect.top - 8,
                  left: targetRect.left - 8,
                  width: targetRect.width + 16,
                  height: targetRect.height + 16,
              }}
          />
      )}

      {/* Popover */}
      <div
        className="pointer-events-auto bg-[#181B21] border border-[#2D313A] shadow-2xl p-6 rounded-2xl max-w-sm w-full animate-in fade-in zoom-in-95 duration-300"
        style={popoverStyle}
      >
        <button onClick={() => handleComplete(true)} className="absolute top-4 right-4 text-gray-500 hover:text-white">
          <X size={16} />
        </button>
        
        <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-[#FF4F5E]/20 text-[#FF4F5E] flex items-center justify-center font-bold text-sm border border-[#FF4F5E]/30">
              {currentStep + 1}
            </div>
            <h3 className="text-lg font-bold text-white">{step.title}</h3>
        </div>

        <p className="text-gray-300 text-sm leading-relaxed mb-6">{step.description}</p>
        
        {currentStep === STEPS.length - 1 && (
            <div className="flex items-center gap-2 mb-4">
                <input
                    id="dont-show-again"
                    type="checkbox"
                    checked={showDontShowAgain}
                    onChange={(e) => setShowDontShowAgain(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-jirai-accent focus:ring-jirai-accent"
                />
                <label htmlFor="dont-show-again" className="text-xs text-gray-400">Don't show again</label>
            </div>
        )}

        <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
                {STEPS.map((_, i) => (
                    <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${ i === currentStep ? 'w-5 bg-[#FF4F5E]' : 'w-1.5 bg-gray-600'}`} />
                ))}
            </div>
            <div className="flex items-center gap-2">
                {currentStep > 0 && (
                    <button onClick={handlePrev} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg">
                        <ChevronLeft size={16} />
                    </button>
                )}
                <button 
                  onClick={() => handleNext()}
                  className="flex items-center gap-2 px-4 py-2 bg-[#FF4F5E] hover:bg-red-600 text-white rounded-lg font-medium text-sm transition-colors"
                >
                  {currentStep === STEPS.length - 1 ? 'Finish' : 'Next'}
                  {currentStep === STEPS.length - 1 ? <Check size={16} /> : <ChevronRight size={16} />}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
