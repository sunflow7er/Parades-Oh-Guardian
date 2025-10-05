import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('UI Crash Captured by ErrorBoundary:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) this.props.onReset();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-6">
          <div className="max-w-xl w-full bg-gray-800/70 backdrop-blur-md rounded-2xl p-8 border border-red-500/30 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🛑</span>
              <h1 className="text-2xl font-bold text-red-300">Something went wrong</h1>
            </div>
            <p className="text-gray-300 mb-4">An unexpected error occurred while rendering the analysis interface.</p>
            <pre className="text-xs bg-gray-900/70 p-4 rounded-lg text-red-400 overflow-auto max-h-40 mb-6 whitespace-pre-wrap">
{this.state.error?.toString()}
            </pre>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={this.handleReset} className="flex-1 px-4 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition">Retry</button>
              <button onClick={() => window.location.reload()} className="flex-1 px-4 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-semibold transition">Full Reload</button>
            </div>
            <div className="mt-6 text-xs text-gray-500 text-center">
              NASA Weather Mining Station • Resilience Layer Active
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;