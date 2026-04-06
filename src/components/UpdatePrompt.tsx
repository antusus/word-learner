import { useRegisterSW } from 'virtual:pwa-register/react';

export function UpdatePrompt() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (!needRefresh) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1rem',
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#667eea',
        color: '#fff',
        padding: '0.75rem 1.25rem',
        borderRadius: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        zIndex: 9999,
      }}
    >
      <span>A new version is available.</span>
      <button
        type="button"
        onClick={() => updateServiceWorker(true)}
        style={{
          background: '#fff',
          color: '#667eea',
          border: 'none',
          borderRadius: '0.25rem',
          padding: '0.375rem 0.75rem',
          cursor: 'pointer',
          fontWeight: 600,
        }}
      >
        Update
      </button>
    </div>
  );
}
