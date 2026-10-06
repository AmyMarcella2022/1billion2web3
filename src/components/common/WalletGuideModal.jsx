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

const WalletGuideModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4'
      onClick={onClose}
    >
      <div
        className='relative w-full max-w-lg bg-base-100 text-black rounded-lg overflow-hidden shadow-2xl max-h-[85vh] flex flex-col'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex items-center justify-between px-4 py-3 bg-base-200'>
          <h3 className='font-poppins font-semibold text-sm md:text-base'>
            Getting a Wallet for Your NFTs
          </h3>
          <button
            onClick={onClose}
            className='text-xl hover:text-error'
            aria-label='Close'
            type='button'
          >
            <AiOutlineCloseCircle />
          </button>
        </div>

        <div className='overflow-y-auto px-4 py-4 text-sm space-y-4'>
          <p>
            The module NFTs and certificate you earn here are sent directly to the wallet
            address you enter below, on the <strong>{NETWORK.name}</strong> network. Use a
            wallet you control and make sure it's switched to that network before copying
            your address in.
          </p>

          <div>
            <p className='font-semibold mb-1'>1. Get a wallet (pick one)</p>
            <ul className='list-disc list-inside space-y-1'>
              <li>
                <strong>MetaMask</strong> — browser extension or mobile app. Install from{' '}
                <a
                  href='https://metamask.io/download'
                  target='_blank'
                  rel='noreferrer'
                  className='link link-primary'
                >
                  metamask.io/download
                </a>
                , then follow its setup to create a new wallet. Save your recovery phrase
                somewhere safe — never share it with anyone.
              </li>
              <li>
                <strong>Trust Wallet</strong> — mobile app. Install from{' '}
                <a
                  href='https://trustwallet.com/download'
                  target='_blank'
                  rel='noreferrer'
                  className='link link-primary'
                >
                  trustwallet.com/download
                </a>
                , then create a new wallet in the app. Same rule: keep your recovery phrase
                private.
              </li>
            </ul>
          </div>

          <div>
            <p className='font-semibold mb-1'>2. Switch to the {NETWORK.name} network</p>
            <p className='mb-1'>
              Most wallets let you search for "Optimism Sepolia" directly in their network
              list. If it's not listed, add it manually with these details:
            </p>
            <div className='bg-base-200 rounded p-2 font-mono text-xs space-y-0.5'>
              <div>Network Name: {NETWORK.name}</div>
              <div>RPC URL: {NETWORK.rpcUrl}</div>
              <div>Chain ID: {NETWORK.chainId}</div>
              <div>Currency Symbol: {NETWORK.currencySymbol}</div>
              <div>Block Explorer: {NETWORK.explorer}</div>
            </div>
          </div>

          <div>
            <p className='font-semibold mb-1'>3. Copy your wallet address</p>
            <p>
              In your wallet app, tap your account name or the "Receive" button to see your
              address — it starts with <span className='font-mono'>0x</span>. Copy it and
              paste it into the Wallet Address field on this page.
            </p>
          </div>

          <p className='text-xs text-gray-500'>
            This is a testnet, used for this learning program — it won't ask you to spend
            real funds to receive your NFTs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WalletGuideModal;
