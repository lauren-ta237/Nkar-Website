import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by Admin ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8F6F0] dark:bg-stone-950 flex flex-col items-center justify-center p-6 text-stone-900 dark:text-stone-100">
          <div className="max-w-md w-full bg-white dark:bg-stone-900 border border-[#E8E4DA] dark:border-stone-800 rounded-2xl p-6 sm:p-8 shadow-xl text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              Something went wrong
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
              An unexpected interface error occurred. You can reload the administration portal or reset your current view.
            </p>

            {this.state.error?.message && (
              <div className="mt-4 p-3 bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-xl text-left">
                <p className="text-[10px] font-mono text-stone-500 dark:text-stone-400 truncate">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="mt-6 w-full py-2.5 px-4 bg-[#153E2E] hover:bg-[#0E2C20] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Administrative Portal</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
