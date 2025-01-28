import React, { Component, ReactNode } from "react";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-svh">
          <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
            <img
              src="https://i.imgur.com/flHudHE.png"
              alt="error"
              className="w-48"
            />
            <h3 className="text-[2.5rem] font-bold leading-tight">Oops...</h3>
            <p className="text-center font-medium text-muted-foreground">
              Something went wrong
            </p>
            <div className="mt-6 flex gap-4">
              <button
                className="px-4 py-2 bg-purple-700 text-white font-bold rounded hover:bg-blue-700"
                onClick={() => window.location.reload()}
              >
                Reload
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
