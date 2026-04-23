import { Component, type ErrorInfo, type ReactNode } from "react";

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
}

export default class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("App render failed:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background px-6 text-center text-foreground">
          <div className="max-w-md space-y-3">
            <h1 className="font-heading text-2xl">Triviolivia couldn&apos;t finish loading</h1>
            <p className="font-body text-sm text-muted-foreground">
              This browser is missing something the game needs. Please try refreshing, or open the game on a newer browser if this screen stays here.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}