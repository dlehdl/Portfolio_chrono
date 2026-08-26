import React from 'react';
import ReactDOM from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import App from './App';

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0a0a0a', color: '#e7e5e4', padding: 24, textAlign: 'center', fontFamily: 'system-ui,sans-serif'
    }}>
      <div style={{ maxWidth: 480 }}>
        <p style={{ marginBottom: 8, fontSize: '1.1rem' }}>오류가 발생했습니다.</p>
        <pre style={{ background: '#1c1917', padding: 12, borderRadius: 6, fontSize: 12, color: '#fca5a5', textAlign: 'left', overflow: 'auto', marginBottom: 16 }}>
          {error?.message || String(error)}
        </pre>
        <p style={{ color: '#a8a29e', fontSize: '0.95rem' }}>
          위 메시지를 확인한 뒤 수정하거나, F12 → Console에서 상세 스택을 확인해 보세요.
        </p>
      </div>
    </div>
  );
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

document.getElementById('preview-fallback')?.remove();

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary
      fallbackRender={({ error }) => <ErrorFallback error={error} />}
      onError={(err) => console.error('App error:', err)}
    >
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);