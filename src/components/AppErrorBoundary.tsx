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
            <p
              className="text-sm font-subheading font-bold tracking-[0.2em] uppercase"
              style={{ color: "hsl(185 70% 55%)" }}
            >
              Hiccup
            </p>
            <h1
              className="text-4xl font-heading font-extrabold uppercase leading-none tracking-tight"
              style={{
                background: "linear-gradient(0deg, #e93e3a 0%, #ed683c 11%, #f3903f 33%, #fdc70c 72%, #fff33b 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                lineHeight: 1.05,
              }}
            >
              Triviolivia couldn&apos;t finish loading
            </h1>
            <p className="text-sm leading-relaxed font-body font-semibold text-white">
              This browser is missing something the game needs. Please try refreshing, or open the game on a newer browser if this screen stays here.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}