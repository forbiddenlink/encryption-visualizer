import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useVisualizationStore } from '@/store/visualizationStore';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  variant?: 'visualization' | 'lesson';
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
    console.error('Visualization error:', error, errorInfo);
  }

  private handleReset = () => {
    const store = useVisualizationStore.getState();
    store.reset();
    store.setSteps([]);
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="glass-card p-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="p-3 bg-red-100 dark:bg-red-500/20 rounded-full">
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {this.props.variant === 'lesson' ? 'This lesson could not load' : 'Something went wrong'}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                {this.props.variant === 'lesson' ? 'Check your connection and reload the page to download the lesson again.' : 'The visualization encountered an error. Try again to clear this run and generate a fresh visualization.'}
              </p>
              <button
                onClick={this.props.variant === 'lesson' ? () => window.location.reload() : this.handleReset}
                className="btn-primary inline-flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                {this.props.variant === 'lesson' ? 'Reload lesson' : 'Try Again'}
              </button>
              {this.props.variant === 'lesson' && <a href="/" className="btn-secondary inline-flex ml-3">Return home</a>}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
