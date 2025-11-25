
import React, { useState, useEffect } from 'react';
import { X, ChevronRight, Check } from 'lucide-react';

const STEPS = [
  {
    title: "Welcome to Jirai",
    description: "Experience a new way to organize thoughts using AI-powered spatial intelligence.",
    target: null
  },
  {
    title: "Create Nodes",
    description: "Double-click anywhere on the canvas or press 'Ctrl+N' to create a new topic node.",
    target: "canvas"
  },
  {
    title: "AI Assistant",
    description: "Use the prompt bar below to generate complex mind maps, project plans, or research topics instantly.",
    target: "#assistant-input"
  },
  {
    title: "View Modes",
    description: "Switch between Analysis (Mind Map), Management (Timeline), and Workflow (Calendar) views.",
    target: "#sidebar-nav"
  },
  {
    title: "You're Ready!",
    description: "Start building your workspace. Don't forget to try Right-Clicking nodes for more options!",
    target: null
  }
];

export const OnboardingTutorial: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const completed = localStorage.getItem('jirai_tutorial_completed');
    if (!completed) {
      setIsVisible(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem('jirai_tutorial_completed', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const step = STEPS[currentStep];

  if (!step) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Backdrop with cutout effect simulation (simplified as dark overlay) */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] pointer-events-auto transition-opacity duration-500" />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="bg-[#181B21] border border-[#FF4F5E]/30 shadow-[0_0_30px_rgba(255,79,94,0.15)] p-6 rounded-2xl max-w-md w-full pointer-events-auto relative animate-in fade-in zoom-in duration-300">
          
          <button 
            onClick={handleComplete} 
            className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-[#FF4F5E]/20 text-[#FF4F5E] flex items-center justify-center font-bold text-sm border border-[#FF4F5E]/30">
              {currentStep + 1}
            </div>
            <h3 className="text-lg font-bold text-white">{step.title}</h3>
          </div>

          <p className="text-gray-300 text-sm leading-relaxed mb-6">
            {step.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {STEPS.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentStep ? 'w-6 bg-[#FF4F5E]' : 'w-1.5 bg-gray-700'
                  }`} 
                />
              ))}
            </div>
            
            <button 
              onClick={handleNext}
              className="flex items-center gap-2 px-4 py-2 bg-white text-black hover:bg-gray-200 rounded-lg font-medium text-sm transition-colors"
            >
              {currentStep === STEPS.length - 1 ? 'Get Started' : 'Next'}
              {currentStep === STEPS.length - 1 ? <Check size={14} /> : <ChevronRight size={14} />}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
