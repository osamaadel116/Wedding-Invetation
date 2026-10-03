import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error inside ErrorBoundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6 text-center">
          <div className="max-w-md bg-white p-8 rounded-2xl shadow-xl border border-[#E6DCce]">
            <h1 className="font-serif-display text-2xl font-bold text-[#2E2420] mb-3">
              Wedding Invitation
            </h1>
            <p className="text-sm font-sans-body text-[#70584D] mb-6">
              A temporary issue occurred while loading this page. Please refresh to load the invitation.
            </p>
            <button
              onClick={() => {
                localStorage.removeItem('wedding_custom_config');
                window.location.reload();
              }}
              className="px-6 py-2.5 rounded-full bg-[#8C6D3B] text-white font-medium text-sm hover:bg-[#72572D] transition-colors cursor-pointer"
            >
              Reload Invitation
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
