import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getProgress } from '../../firebase';
import useAuthUser from '../../hooks/useAuthUser';
import {
  findUserDoc, touchUser, serverTimestamp, loadCustomFaqs, getUnseenReplies,
  updateSupportRequest, createSupportRequest, hasFeedback, submitFeedback,
} from '../../services/platform';
import { askAI } from '../../services/ai';
import {
  findAnswer, looksLikeQuizQuestion, isGreeting, isThanks, QUICK_CHIPS,
} from './knowledge';

// The assistant is ONLY shown on these screens. It is deliberately absent from /module/:id
// (where learners answer quiz questions) and it never answers quiz questions.
const VISIBLE_ON = ['/dashboard', '/success'];
const CATEGORIES = ['Account / login', 'Wallet address', 'NFTs / certificate', 'Technical problem', 'Something else'];

const firstNameOf = (userDoc, user) =>
  ((userDoc && userDoc.name) || (user && user.displayName) || (user && user.email) || 'there').split(/[\s@]/)[0];

const ChatAssistant = () => {
  const { pathname } = useLocation();
  const { user, ready } = useAuthUser();
  const visible = ready && !!user && VISIBLE_ON.includes(pathname);

  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('chat'); // chat | form | feedback
  const [pending, setPending] = useState(null); // unanswered question text
  const [userDoc, setUserDoc] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [form, setForm] = useState({ category: CATEGORIES[0], message: '' });
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [busy, setBusy] = useState(false);
  const [thinking, setThinking] = useState(false);
  const endRef = useRef(null);

  const say = (text, from = 'bot') => {
    setMessages((m) => [...m, { from, text }]);
    if (from === 'bot') setUnread(true);
  };

  /* ----- welcome / welcome back (once per login session) + feedback request ----- */
  useEffect(() => {
    if (!visible) return undefined;
    let cancelled = false;
    const email = user.email;
    const greetKey = `bot_greeted_${email}`;

    (async () => {
      try {
        const [doc, custom] = await Promise.all([findUserDoc(email), loadCustomFaqs()]);
        if (cancelled) return;
        setUserDoc(doc);
        setFaqs(custom);

        if (!sessionStorage.getItem(greetKey)) {
          sessionStorage.setItem(greetKey, '1');
          const name = firstNameOf(doc, user);
          const progress = (await getProgress(email)) || 0;
          if (cancelled) return;

          if (!doc || !doc.botWelcomedAt) {
            say(
              `Welcome to the 1Billion2Web3 Quest, ${name}! 👋\n\n💡 Quick tip: watch each module’s video first — the quiz unlocks once you’ve opened it, and you can rewatch it anytime from the quiz page.\n\nI can help with how the platform works (wallets, NFTs, certificates). I can’t help with quiz answers — that’s the learning part!`
            );
          } else if (progress >= 9) {
            say(`Welcome back, ${name}! 🎉 You’ve completed all 9 modules.`);
          } else {
            say(
              `Welcome back, ${name}! 🙌 You’ve completed ${progress} of 9 modules — next up is Module ${progress + 1}.`
            );
          }
          if (doc) {
            touchUser(doc.id, {
              lastSeenAt: serverTimestamp(),
              ...(doc.botWelcomedAt ? {} : { botWelcomedAt: serverTimestamp() }),
            }).catch(() => {});
          }
          setOpen(true);

          // replies from the team to earlier requests
          const replies = await getUnseenReplies(email).catch(() => []);
          if (cancelled) return;
          for (const r of replies) {
            if (r.status !== 'open' && r.adminReply) {
              say(`📬 The team replied to your request (“${(r.message || '').slice(0, 60)}…”):\n\n${r.adminReply}`);
              updateSupportRequest(r.id, { seenByUser: true }).catch(() => {});
            }
          }
        }

        // End of the 9 modules → ask for a review (once, until they answer)
        if (!sessionStorage.getItem('bot_feedback_dismissed')) {
          setTimeout(async () => {
            try {
              const p = (await getProgress(email)) || 0;
              if (cancelled || p < 9) return;
              if (await hasFeedback(email)) return;
              setMessages((m) =>
                m.some((x) => x.feedbackAsk)
                  ? m
                  : [...m, {
                      from: 'bot',
                      feedbackAsk: true,
                      text: '🎓 You finished all 9 modules — congratulations! Would you share a quick review of your experience? It helps us improve the programme.',
                    }]
              );
              setMode('feedback');
              setOpen(true);
              setUnread(true);
            } catch (e) {
              /* ignore */
            }
          }, 1800);
        }
      } catch (e) {
        console.log(e);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, pathname, user && user.email]);

  useEffect(() => {
    if (open) {
      setUnread(false);
      endRef.current && endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open, mode, pending, thinking]);

  if (!visible) return null;

  /* ----- chat ----- */
  const handleSend = (raw) => {
    const text = (raw || '').trim();
    if (!text || thinking) return;
    setInput('');
    say(text, 'user');
    setPending(null);

    if (looksLikeQuizQuestion(text)) {
      say(
        'I can’t help with quiz questions or answers — working them out is how you earn your NFTs! 😊 Rewatch the module video (it’s linked at the top of each quiz) and you’ll find what you need.'
      );
      return;
    }
    if (isGreeting(text) && text.split(/\s+/).length <= 3) {
      say('Hi! What can I help you with? You can pick a topic below or type your question.');
      return;
    }
    if (isThanks(text) && text.split(/\s+/).length <= 6) {
      say('You’re welcome! 🌟');
      return;
    }
    // Fallback = the built-in keyword helper (used if the AI is switched off or unreachable)
    const fallback = () => {
      const hit = findAnswer(text, faqs);
      if (hit) {
        say(hit.faq.answer);
        if (hit.faq.escalate) setPending(text);
        return;
      }
      say('I’m not sure about that one. Would you like me to send it to the team? They’ll get an alert and can reply to you.');
      setPending(text);
    };

    const history = [...messages, { from: 'user', text }]
      .filter((m) => !m.feedbackAsk)
      .slice(-8)
      .map((m) => ({ role: m.from === 'user' ? 'user' : 'assistant', content: m.text }));

    setThinking(true);
    askAI(user, history)
      .then((r) => {
        if (r.disabled) return fallback();
        if (r.noAnswer) {
          say('I don’t have that information yet. Would you like me to send your question to the team? They’ll get an alert and can reply to you.');
          setPending(text);
          return undefined;
        }
        say(r.reply);
        return undefined;
      })
      .catch((err) => {
        console.log(err);
        if (err.status === 429) say('You’re sending messages quickly — please wait a few minutes and try again.');
        else fallback();
      })
      .finally(() => setThinking(false));
  };

  const openForm = (prefill) => {
    setForm({ category: CATEGORIES[0], message: prefill || '' });
    setMode('form');
    setPending(null);
  };

  const sendForm = async (e) => {
    e.preventDefault();
    if (form.message.trim().length < 5) return;
    setBusy(true);
    try {
      const progress = (await getProgress(user.email).catch(() => 0)) || 0;
      await createSupportRequest({
        name: (userDoc && userDoc.name) || '',
        email: user.email,
        category: form.category,
        message: form.message.trim(),
        page: pathname,
        progress,
      });
      setMode('chat');
      say('✅ Sent! The team has been alerted. Their reply will show up here the next time you open the dashboard.');
    } catch (err) {
      console.log(err);
      say('Sorry, I couldn’t send that just now. Please check your connection and try again.');
      setMode('chat');
    } finally {
      setBusy(false);
    }
  };

  const sendFeedback = async (e) => {
    e.preventDefault();
    if (!rating) return;
    setBusy(true);
    try {
      await submitFeedback(user.email, userDoc && userDoc.name, rating, comment);
      if (userDoc) touchUser(userDoc.id, { feedbackGiven: true }).catch(() => {});
      sessionStorage.setItem('bot_feedback_dismissed', '1');
      setMode('chat');
      say('Thank you so much for your feedback! 💙 We really appreciate it.');
    } catch (err) {
      console.log(err);
      say('I couldn’t save your review just now — please try again in a moment.');
    } finally {
      setBusy(false);
    }
  };

  const laterFeedback = () => {
    sessionStorage.setItem('bot_feedback_dismissed', '1');
    setMode('chat');
    say('No problem — I’ll ask again next time you visit.');
  };

  /* ----- UI ----- */
  const panel = { backgroundColor: 'var(--qa-surface)', color: 'var(--qa-text)' };

  return (
    <div className='fixed z-40 font-poppins bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))]'>
      {open && (
        <div
          className='fixed inset-x-0 bottom-0 z-50 h-[88dvh] rounded-t-2xl pb-[env(safe-area-inset-bottom)] sm:pb-0 sm:static sm:inset-auto sm:mb-3 sm:w-[380px] sm:h-[600px] sm:max-h-[calc(100dvh-7rem)] sm:rounded-2xl flex flex-col shadow-2xl overflow-hidden'
          style={{ ...panel, border: '1px solid var(--qa-border)' }}
          role='dialog'
          aria-label='Quest assistant'
        >
          <div className='flex items-center justify-between px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:pt-3' style={{ backgroundColor: 'var(--qa-primary)', color: '#fff' }}>
            <div>
              <div className='font-semibold'>Quest Assistant 🤖</div>
              <div className='text-xs' style={{ color: '#e0f2fe' }}>Platform help · no quiz answers</div>
            </div>
            <button type='button' onClick={() => setOpen(false)} aria-label='Close assistant' className='text-3xl leading-none min-h-[44px] min-w-[44px]'>
              ×
            </button>
          </div>

          <div className='flex-1 overflow-y-auto overscroll-contain p-3 space-y-2' style={{ backgroundColor: 'var(--qa-surface2)' }}>
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className='rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap max-w-[85%]'
                  style={
                    m.from === 'user'
                      ? { backgroundColor: 'var(--qa-primary)', color: '#fff' }
                      : { backgroundColor: 'var(--qa-surface3)', color: 'var(--qa-text)' }
                  }
                >
                  {m.text}
                </div>
              </div>
            ))}

            {thinking && (
              <div className='flex justify-start'>
                <div className='rounded-2xl px-3 py-2 text-sm' style={{ backgroundColor: 'var(--qa-surface3)', color: 'var(--qa-muted)' }}>Thinking…</div>
              </div>
            )}

            {pending && mode === 'chat' && (
              <div className='flex gap-2 flex-wrap'>
                <button type='button' onClick={() => openForm(pending)} className='rounded-full px-3 py-1.5 text-sm font-semibold' style={{ backgroundColor: 'var(--qa-primary)', color: '#fff' }}>
                  Send to the team
                </button>
                <button type='button' onClick={() => setPending(null)} className='rounded-full px-3 py-1.5 text-sm' style={{ backgroundColor: 'var(--qa-surface3)', color: 'var(--qa-text)' }}>
                  No thanks
                </button>
              </div>
            )}

            {mode === 'feedback' && (
              <form onSubmit={sendFeedback} className='rounded-xl p-3 space-y-2' style={{ backgroundColor: 'var(--qa-surface)', border: '1px solid var(--qa-border)' }}>
                <div className='flex justify-center gap-1' role='radiogroup' aria-label='Rating'>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type='button'
                      onClick={() => setRating(n)}
                      aria-label={`${n} star${n > 1 ? 's' : ''}`}
                      className='text-3xl'
                      style={{ color: n <= rating ? '#f59e0b' : 'var(--qa-star-off)' }}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  placeholder='What did you enjoy? What could be better?'
                  className='w-full rounded-lg p-2 text-sm'
                  style={{ border: '1px solid var(--qa-border-strong)', color: 'var(--qa-text)', backgroundColor: 'var(--qa-surface)' }}
                />
                <div className='flex gap-2'>
                  <button type='submit' disabled={!rating || busy} className='flex-1 rounded-full py-2 text-sm font-semibold' style={{ backgroundColor: rating ? 'var(--qa-primary)' : 'var(--qa-disabled)', color: '#fff' }}>
                    {busy ? 'Sending…' : 'Submit review'}
                  </button>
                  <button type='button' onClick={laterFeedback} className='rounded-full px-3 py-2 text-sm' style={{ backgroundColor: 'var(--qa-surface3)', color: 'var(--qa-text)' }}>
                    Later
                  </button>
                </div>
              </form>
            )}

            {mode === 'form' && (
              <form onSubmit={sendForm} className='rounded-xl p-3 space-y-2' style={{ backgroundColor: 'var(--qa-surface)', border: '1px solid var(--qa-border)' }}>
                <div className='text-sm font-semibold'>Message the team</div>
                <div className='text-xs' style={{ color: 'var(--qa-muted)' }}>Replying to: {user.email}</div>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className='w-full rounded-lg p-2 text-sm'
                  style={{ border: '1px solid var(--qa-border-strong)', color: 'var(--qa-text)', backgroundColor: 'var(--qa-surface)' }}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={4}
                  required
                  minLength={5}
                  placeholder='Tell us what you need help with…'
                  className='w-full rounded-lg p-2 text-sm'
                  style={{ border: '1px solid var(--qa-border-strong)', color: 'var(--qa-text)', backgroundColor: 'var(--qa-surface)' }}
                />
                <div className='flex gap-2'>
                  <button type='submit' disabled={busy} className='flex-1 rounded-full py-2 text-sm font-semibold' style={{ backgroundColor: 'var(--qa-primary)', color: '#fff' }}>
                    {busy ? 'Sending…' : 'Send'}
                  </button>
                  <button type='button' onClick={() => setMode('chat')} className='rounded-full px-3 py-2 text-sm' style={{ backgroundColor: 'var(--qa-surface3)', color: 'var(--qa-text)' }}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
            <div ref={endRef} />
          </div>

          {mode === 'chat' && (
            <div style={{ borderTop: '1px solid var(--qa-border)' }}>
              <div className='flex gap-1.5 overflow-x-auto px-3 pt-2'>
                {QUICK_CHIPS.map((c) => (
                  <button key={c} type='button' onClick={() => handleSend(c)} className='whitespace-nowrap rounded-full px-3 py-1 text-xs' style={{ backgroundColor: 'var(--qa-accent-soft)', color: 'var(--qa-accent-text)' }}>
                    {c}
                  </button>
                ))}
                <button type='button' onClick={() => openForm('')} className='whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold' style={{ backgroundColor: 'var(--qa-warn-bg)', color: 'var(--qa-warn-text)' }}>
                  Contact the team
                </button>
              </div>
              <form
                className='flex gap-2 p-3'
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(input);
                }}
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder='Ask about the platform…'
                  className='flex-1 rounded-full px-4 py-2 text-sm'
                  style={{ border: '1px solid var(--qa-border-strong)', color: 'var(--qa-text)', backgroundColor: 'var(--qa-surface)' }}
                />
                <button type='submit' className='rounded-full px-4 py-2 text-sm font-semibold' style={{ backgroundColor: 'var(--qa-primary)', color: '#fff' }}>
                  Send
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      <div className='flex justify-end'>
        <button
          type='button'
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close assistant' : 'Open assistant'}
          className={`relative rounded-full shadow-xl w-14 h-14 text-2xl ${open ? 'hidden sm:block' : ''}`}
          style={{ backgroundColor: 'var(--qa-primary)', color: '#fff' }}
        >
          {open ? '×' : '💬'}
          {unread && !open && (
            <span className='absolute -top-1 -right-1 w-4 h-4 rounded-full' style={{ backgroundColor: '#ef4444', border: '2px solid #fff' }} />
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatAssistant;
