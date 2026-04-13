import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "2rem", background: "#f5f0e1" }}>
          <div style={{ textAlign: "center", maxWidth: "600px" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#3a3a32", fontFamily: "'Amiri', serif" }}>حدث خطأ غير متوقع</h2>
            <button
              onClick={() => window.location.reload()}
              style={{ padding: "0.75rem 1.5rem", background: "#8b2e3b", color: "#fff", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontSize: "1rem", fontFamily: "'Amiri', serif" }}
            >
              إعادة تحميل الصفحة
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
