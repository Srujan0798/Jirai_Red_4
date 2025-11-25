import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Github, ChevronRight, ChevronDown } from 'lucide-react';

export interface ErrorBoundaryProps {
  children?: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false,
  };

  public static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private toggleDetails = () => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0F1115] text-[#E0E0E0] p-4">
          <div className="bg-[#181B21] border border-[#2D313A] rounded-2xl p-8 max-w-lg w-full shadow-2xl flex flex-col items-center text-center">
            <div className="bg-red-500/10 p-4 rounded-full mb-6 animate-pulse">
              <AlertTriangle size={48} className="text-[#FF4F5E]" />
            </div>

            <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
            <p className="text-gray-400 mb-8 font-sans">
              Jirai encountered an unexpected error. We've logged the issue and you can try reloading
              to recover your workspace.
            </p>

            <div className="flex flex-wrap gap-3 justify-center w-full mb-8">
              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 px-5 py-3 bg-[#FF4F5E] hover:bg-[#d63f4c] text-white rounded-xl font-medium transition-colors shadow-lg shadow-red-900/20"
              >
                <RefreshCw size={18} />
                Try Again
              </button>

              <button
                onClick={this.handleGoHome}
                className="flex items-center gap-2 px-5 py-3 bg-[#2D313A] hover:bg-[#3D414A] text-white rounded-xl font-medium transition-colors"
              >
                <Home size={18} />
                Go Home
              </button>

              <a
                href="https://github.com/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3 bg-[#2D313A] hover:bg-[#3D414A] text-white rounded-xl font-medium transition-colors"
              >
                <Github size={18} />
                Report Issue
              </a>
            </div>

            <div className="w-full text-left border-t border-[#2D313A] pt-4">
              <button
                onClick={this.toggleDetails}
                className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-300 font-mono uppercase tracking-wider mb-2 transition-colors"
              >
                {this.state.showDetails ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                Error Details
              </button>

              {this.state.showDetails && (
                <div className="bg-[#0F1115] rounded-lg p-4 border border-[#2D313A] overflow-x-auto max-h-48 custom-scrollbar">
                  <p className="text-red-400 font-mono text-xs mb-2 break-all">
                    {this.state.error?.toString()}
                  </p>
                  <pre className="text-gray-600 font-mono text-[10px] whitespace-pre-wrap">
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}