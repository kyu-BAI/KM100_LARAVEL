import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Crash Error:', error, errorInfo);
  }

  handleHardReset = async () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
      }
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map(r => r.unregister()));
      }
    } catch (e) {
      console.error('Hard reset error:', e);
    }
    window.location.replace(window.location.origin + window.location.pathname + '?v=' + Date.now());
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#0b1120',
          color: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div style={{
            maxWidth: 480,
            width: '100%',
            backgroundColor: '#252525',
            padding: 24,
            borderRadius: 14,
            border: '1px solid #1e293b',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
          }}>
            <h2 style={{ color: '#f87171', margin: '0 0 10px 0', fontSize: 20, fontWeight: 700 }}>
              System Notice
            </h2>
            <p style={{ color: '#94a3b8', fontSize: 13, margin: '0 0 18px 0', lineHeight: 1.5 }}>
              {this.state.error?.message || 'An unexpected error occurred while loading the application.'}
            </p>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={this.handleHardReset}
                style={{
                  backgroundColor: '#f47721',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 22px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Clear Cache & Update App
              </button>
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                }}
                style={{
                  backgroundColor: '#1e293b',
                  color: '#cbd5e1',
                  border: '1px solid #334155',
                  padding: '12px 18px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Retry
              </button>
            </div>

            {this.state.error?.stack && (
              <details style={{ marginTop: 18, textAlign: 'left', backgroundColor: '#020617', padding: 10, borderRadius: 8, border: '1px solid #1e293b' }}>
                <summary style={{ cursor: 'pointer', color: '#f47721', fontSize: 11, fontWeight: 600 }}>
                  Technical Diagnostics
                </summary>
                <pre style={{ fontSize: 10, color: '#fca5a5', overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all', marginTop: 8, fontFamily: 'monospace' }}>
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
