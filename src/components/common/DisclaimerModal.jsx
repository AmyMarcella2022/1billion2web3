import React, { useState } from 'react';

const KEY = 'disclaimer_accepted_v1';

// Shown once each time the platform is opened (per browser session), before anything else.
const DisclaimerModal = () => {
  const [open, setOpen] = useState(() => {
    try {
      return sessionStorage.getItem(KEY) !== '1';
    } catch (e) {
      return true;
    }
  });

  if (!open) return null;

  const accept = () => {
    try {
      sessionStorage.setItem(KEY, '1');
    } catch (e) {
      /* ignore */
    }
    setOpen(false);
  };

  return (
    <div
      className='fixed inset-0 z-[100] flex items-center justify-center p-4'
      style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
      role='dialog'
      aria-modal='true'
      aria-labelledby='disclaimer-title'
    >
      <div
        className='w-full max-w-md rounded-xl shadow-2xl overflow-hidden'
        style={{ backgroundColor: 'var(--qa-surface)', color: 'var(--qa-text)' }}
      >
        <div className='px-5 py-4' style={{ backgroundColor: 'var(--qa-warn-bg)', borderBottom: '1px solid var(--qa-warn-border)' }}>
          <h2 id='disclaimer-title' className='font-poppins font-bold text-lg' style={{ color: 'var(--qa-warn-text)' }}>
            ⚠️ Disclaimer
          </h2>
        </div>
        <div className='px-5 py-5 space-y-3 text-base leading-relaxed'>
          <p>
            <strong>This platform is for educational purposes only.</strong>
          </p>
          <p>
            Nothing here is financial, investment, or legal advice. The NFTs, tokens and
            certificates are part of a learning program and run on a test network (OP
            Sepolia), so they carry no guaranteed monetary value.
          </p>
          <p>Never share your wallet recovery phrase with anyone — we will never ask for it.</p>
          <button
            type='button'
            onClick={accept}
            className='w-full rounded-full py-3 font-semibold mt-2'
            style={{ backgroundColor: 'var(--qa-primary)', color: '#ffffff' }}
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerModal;
