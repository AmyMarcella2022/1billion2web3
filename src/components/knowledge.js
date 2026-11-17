import {
  module1, module2, module3, module4, module5, module6, module7, module8, module9,
} from '../../utils';

/* ------------------------------------------------------------------
   Built-in help topics. The assistant ONLY knows how the platform works.
   It has no access to quiz answers and refuses to help with quiz questions.
   ------------------------------------------------------------------ */
export const BUILT_IN_FAQS = [
  {
    id: 'how',
    keywords: ['how', 'work', 'works', 'start', 'begin', 'getting started', 'platform', 'about', 'what is this'],
    question: 'How does the platform work?',
    answer:
      'There are 9 modules. For each one: open the module on your dashboard, watch the short video (“Take Metaverse Class”), then take the module quiz. Finish all 9 and you can request your completion certificate and NFTs.',
  },
  {
    id: 'locked',
    keywords: ['locked', 'lock', 'unlock', 'cant open', 'cannot open', 'quiz locked', 'next module', 'greyed', 'disabled'],
    question: 'Why is my quiz or module locked?',
    answer:
      'Modules unlock in order. A quiz opens after you have opened that module’s video, and the next module opens after you finish the previous quiz. If something stays locked after you finished the step before it, refresh the dashboard once.',
  },
  {
    id: 'video',
    keywords: ['video', 'watch', 'class', 'metaverse class', 'not playing', 'wont play', 'buffering'],
    question: 'The video will not play',
    answer:
      'Try a stable connection or switch from mobile data to Wi-Fi, then reopen the video from “Take Metaverse Class”. You can also rewatch any video from the top of its quiz page.',
  },
  {
    id: 'wallet',
    keywords: ['wallet', 'metamask', 'trust wallet', 'address', 'network', 'op sepolia', 'optimism', 'sepolia', 'chain'],
    question: 'Which wallet and network should I use?',
    answer:
      'Use a wallet you control (MetaMask or Trust Wallet) on the OP Sepolia test network. Chain ID 11155420, RPC https://sepolia.optimism.io, currency ETH. Copy your 0x… address and use it as your wallet address. Never share your recovery phrase with anyone — including me.',
  },
  {
    id: 'wallet-change',
    keywords: ['change wallet', 'wrong wallet', 'wrong address', 'update wallet', 'new wallet', 'edit wallet'],
    question: 'I entered the wrong wallet address',
    answer:
      'I can’t change it myself, but the team can. Please send a request with the correct address and they will update it for you.',
    escalate: true,
  },
  {
    id: 'nft',
    keywords: ['nft', 'nfts', 'token', 'tokens', 'lotus', 'received', 'not received', 'havent received', 'mint', 'minted', 'reward'],
    question: 'When do I get my NFTs?',
    answer:
      'Module NFTs and your certificate are sent to the wallet address on your profile, on the OP Sepolia network, after you complete the modules and request your certificate. Minting can take a little while. If it has been a long time, send a request and the team will check.',
  },
  {
    id: 'cert',
    keywords: ['certificate', 'completion', 'finish', 'finished', 'complete', 'completed', 'done all'],
    question: 'How do I get my certificate?',
    answer:
      'Complete all 9 modules, then tap “Request Completion Certificate” at the bottom of your dashboard. The button only becomes active after Module 9.',
  },
  {
    id: 'password',
    keywords: ['password', 'forgot', 'reset', 'login', 'log in', 'sign in', 'cant login', 'cannot login'],
    question: 'I forgot my password / cannot log in',
    answer:
      'I can’t reset passwords myself. Send a request with the email you registered with and the team will help you get back in.',
    escalate: true,
  },
  {
    id: 'retry',
    keywords: ['fail', 'failed', 'retry', 'try again', 'attempt', 'incorrect', 'wrong', 'pass', 'passing'],
    question: 'What if I get something wrong in a quiz?',
    answer:
      'You can try again. Rewatching the module video is the best way to prepare — there’s a “Rewatch module video” link at the top of each quiz.',
  },
  {
    id: 'free',
    keywords: ['free', 'cost', 'pay', 'price', 'gas', 'fee', 'fees', 'money', 'testnet'],
    question: 'Does it cost anything?',
    answer:
      'No. This is a learning programme on a test network, so you are not asked to spend real funds to receive your NFTs.',
  },
  {
    id: 'edu',
    keywords: ['advice', 'invest', 'investment', 'financial', 'legal', 'disclaimer', 'educational'],
    question: 'Is this financial advice?',
    answer:
      'No. This platform is for educational purposes only and nothing on it is financial, investment or legal advice.',
  },
  {
    id: 'contact',
    keywords: ['contact', 'support', 'human', 'admin', 'team', 'help me', 'speak', 'talk to'],
    question: 'Contact the team',
    answer: 'Of course — use the “Contact the team” button below and send them a message.',
    escalate: true,
  },
];

/* ---------------- matching ---------------- */
const STOP = new Set(['the', 'a', 'an', 'is', 'are', 'to', 'of', 'and', 'in', 'on', 'for', 'it', 'my', 'i', 'me', 'do', 'does', 'how', 'what', 'can', 'you', 'this', 'that', 'be', 'with', 'at', 'or', 'we', 'your']);
export const tokens = (s) =>
  (s || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t && !STOP.has(t));

// Every quiz question + option is pre-tokenised so we can recognise (and refuse) quiz questions.
const quizBank = [module1, module2, module3, module4, module5, module6, module7, module8, module9]
  .flat()
  .map((q) => ({ q: new Set(tokens(q.question)), full: new Set(tokens(`${q.question} ${q.options.join(' ')}`)) }));

export const looksLikeQuizQuestion = (text) => {
  const t = text.toLowerCase();
  if (/(quiz|test|exam)[^.?!]{0,40}(answer|answers|solution|correct)/.test(t)) return true;
  if (/(answer|answers|solution|correct (option|answer)|which option)[^.?!]{0,40}(quiz|question|module|test)/.test(t)) return true;
  if (/\b(cheat|answer key|give me the answers?)\b/.test(t)) return true;
  const u = new Set(tokens(text));
  if (u.size < 3) return false;
  return quizBank.some((b) => {
    let hit = 0;
    u.forEach((w) => b.full.has(w) && hit++);
    let hitQ = 0;
    b.q.forEach((w) => u.has(w) && hitQ++);
    return (hit / u.size >= 0.75 && u.size >= 4) || (b.q.size >= 4 && hitQ / b.q.size >= 0.7);
  });
};

export const isGreeting = (t) => /^\s*(hi|hello|hey|good (morning|afternoon|evening)|yo|sup)\b/i.test(t);
export const isThanks = (t) => /\b(thanks|thank you|thx|cheers)\b/i.test(t);

// Returns { faq, score } for the best match, or null if nothing is convincing.
export const findAnswer = (text, customFaqs = []) => {
  const lower = text.toLowerCase();
  const words = new Set(tokens(text));
  let best = null;
  [...customFaqs.map((f) => ({ ...f, custom: true })), ...BUILT_IN_FAQS].forEach((faq) => {
    let score = 0;
    (faq.keywords || []).forEach((k) => {
      const kk = k.toLowerCase();
      if (kk.includes(' ') ? lower.includes(kk) : words.has(kk)) score += kk.includes(' ') ? 3 : 2;
    });
    const qWords = tokens(faq.question);
    qWords.forEach((w) => words.has(w) && (score += 1));
    if (!best || score > best.score) best = { faq, score };
  });
  return best && best.score >= 3 ? best : null;
};

export const QUICK_CHIPS = [
  'How does this work?',
  'Which wallet do I use?',
  'When do I get my NFTs?',
  'How do I get my certificate?',
];
