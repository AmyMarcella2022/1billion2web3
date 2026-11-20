import React from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';

// Optimism Sepolia (testnet) network details, for adding it manually in a wallet app.
const NETWORK = {
  name: 'OP Sepolia',
  chainId: '11155420',
  rpcUrl: 'https://sepolia.optimism.io',
  currencySymbol: 'ETH',
  explorer: 'https://sepolia-optimistic.etherscan.io',
};

// Colours are set explicitly (not via the daisyUI theme) and the modal opts out of
// browser "force dark" / OS dark mode, so the text is always dark-on-white and readable.
const S = {
  card: { backgroundColor: 'var(--qa-surface)', color: 'var(--qa-text)' },
  header: { backgroundColor: 'var(--qa-accent-soft)', color: 'var(--qa-accent-text)', borderBottom: '1px solid var(--qa-border)' },
  body: { color: 'var(--qa-text)' },
  strong: { color: 'var(--qa-text)' },
  box: { backgroundColor: 'var(--qa-surface2)', color: 'var(--qa-text)', border: '1px solid var(--qa-border)' },
  link: { color: 'var(--qa-link)', textDecoration: 'underline', fontWeight: 600 },
  note: { color: 'var(--qa-muted)' },
};

const WalletGuideModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 z-[60] flex items-center justify-center p-4'
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      onClick={onClose}
      role='dialog'
      aria-modal='true'
    >
      <div
        className='relative w-full max-w-lg rounded-lg overflow-hidden shadow-2xl max-h-[88vh] flex flex-col'
        style={S.card}
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex items-center justify-between px-4 py-3' style={S.header}>
          <h3 className='font-poppins font-bold text-base md:text-lg'>
            Getting a Wallet for Your NFTs
          </h3>
          <button
            onClick={onClose}
            className='text-2xl'
            style={{ color: 'var(--qa-accent-text)' }}
            aria-label='Close'
            type='button'
          >
            <AiOutlineCloseCircle />
          </button>
        </div>

        <div className='overflow-y-auto px-4 py-4 text-base space-y-4 leading-relaxed' style={S.body}>
          <p>
            The module NFTs and certificate you earn here are sent directly to the wallet
            address you enter below, on the <strong style={S.strong}>{NETWORK.name}</strong>{' '}
            network. Use a wallet you control and make sure it's switched to that network
            before copying your address in.
          </p>

          <div>
            <p className='font-bold mb-1' style={S.strong}>
              1. Get a wallet (pick one)
            </p>
            <ul className='list-disc pl-5 space-y-2'>
              <li>
                <strong style={S.strong}>MetaMask</strong> — browser extension or mobile app.
                Install from{' '}
                <a
                  href='https://metamask.io/download'
                  target='_blank'
                  rel='noreferrer'
                  style={S.link}
                >
                  metamask.io/download
                </a>
                , then follow its setup to create a new wallet. Save your recovery phrase
                somewhere safe — never share it with anyone.
              </li>
              <li>
                <strong style={S.strong}>Trust Wallet</strong> — mobile app. Install from{' '}
                <a
                  href='https://trustwallet.com/download'
                  target='_blank'
                  rel='noreferrer'
                  style={S.link}
                >
                  trustwallet.com/download
                </a>
                , then create a new wallet in the app. Same rule: keep your recovery phrase
                private.
              </li>
            </ul>
          </div>

          <div>
            <p className='font-bold mb-1' style={S.strong}>
              2. Switch to the {NETWORK.name} network
            </p>
            <p className='mb-2'>
              Most wallets let you search for "Optimism Sepolia" directly in their network
              list. If it's not listed, add it manually with these details:
            </p>
            <div className='rounded p-3 font-mono text-sm space-y-1 break-all' style={S.box}>
              <div>Network Name: {NETWORK.name}</div>
              <div>RPC URL: {NETWORK.rpcUrl}</div>
              <div>Chain ID: {NETWORK.chainId}</div>
              <div>Currency Symbol: {NETWORK.currencySymbol}</div>
              <div>Block Explorer: {NETWORK.explorer}</div>
            </div>
          </div>

          <div>
            <p className='font-bold mb-1' style={S.strong}>
              3. Copy your wallet address
            </p>
            <p>
              In your wallet app, tap your account name or the "Receive" button to see your
              address — it starts with <span className='font-mono font-bold'>0x</span>. Copy
              it and paste it into the Wallet Address field on this page.
            </p>
          </div>

          <p className='text-sm' style={S.note}>
            This is a testnet, used for this learning program — it won't ask you to spend
            real funds to receive your NFTs.
          </p>

          <button
            type='button'
            onClick={onClose}
            className='w-full rounded-full py-3 font-semibold'
            style={{ backgroundColor: 'var(--qa-primary)', color: '#ffffff' }}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletGuideModal;
