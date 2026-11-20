import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuthUser from '../../hooks/useAuthUser';
import ThemeToggle from '../common/ThemeToggle';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import {
  db, collection, onSnapshot, getAdminState, callAdmin, addAdmin, removeAdmin,
  sendReset, updateSupportRequest, deleteSupportRequest, addFaq, deleteFaq,
  fmtDate, tsToDate, norm, saveKnowledge, deleteKnowledge, saveBotSettings,
} from '../../services/platform';
import { askAI } from '../../services/ai';

const C = { // fixed light palette so the admin area is readable regardless of device dark mode
  page: { backgroundColor: 'var(--qa-page)', color: 'var(--qa-text)', minHeight: '100dvh' },
  card: { backgroundColor: 'var(--qa-surface)', border: '1px solid var(--qa-border)', borderRadius: 12 },
  input: { backgroundColor: 'var(--qa-surface)', color: 'var(--qa-text)', border: '1px solid var(--qa-border-strong)', borderRadius: 8, padding: '10px 12px', width: '100%', minHeight: 44 },
  btn: { backgroundColor: 'var(--qa-primary)', color: '#fff', borderRadius: 8, padding: '8px 14px', fontWeight: 600, minHeight: 44, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' },
  btnGhost: { backgroundColor: 'var(--qa-surface3)', color: 'var(--qa-text)', borderRadius: 8, padding: '8px 14px', minHeight: 44, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' },
  btnDanger: { backgroundColor: 'var(--qa-danger)', color: '#fff', borderRadius: 8, padding: '8px 14px', fontWeight: 600, minHeight: 44, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' },
  muted: { color: 'var(--qa-muted)' },
};

const csvDownload = (name, rows) => {
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const blob = new Blob([rows.map((r) => r.map(esc).join(',')).join('\n')], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
};

const useCollection = (name, onAdded) => {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const first = useRef(true);
  useEffect(
    () =>
      onSnapshot(
        collection(db, name),
        (snap) => {
          setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
          if (!first.current && onAdded) snap.docChanges().forEach((c) => c.type === 'added' && onAdded({ id: c.doc.id, ...c.doc.data() }));
          first.current = false;
          setLoaded(true);
        },
        (err) => {
          console.log(name, err);
          toast.error(`Could not load ${name}: ${err.code || err.message}`);
          setLoaded(true);
        }
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [name]
  );
  return [items, loaded];
};

const Stat = ({ label, value, hint }) => (
  <div style={C.card} className='p-4'>
    <div className='text-sm' style={C.muted}>{label}</div>
    <div className='text-3xl font-bold'>{value}</div>
    {hint && <div className='text-xs' style={C.muted}>{hint}</div>}
  </div>
);

/* ===================== Overview ===================== */
const Overview = ({ users, requests, feedback }) => {
  const prog = (u) => Number(u.progress) || 0;
  const done = users.filter((u) => prog(u) >= 9).length;
  const started = users.filter((u) => prog(u) > 0 && prog(u) < 9).length;
  const avg = feedback.length ? (feedback.reduce((s, f) => s + (f.rating || 0), 0) / feedback.length).toFixed(1) : '—';
  const dist = Array.from({ length: 10 }, (_, n) => users.filter((u) => prog(u) === n).length);
  const max = Math.max(1, ...dist);
  const recent = [...users].sort((a, b) => (tsToDate(b.createdAt)?.getTime() || 0) - (tsToDate(a.createdAt)?.getTime() || 0)).slice(0, 5);
  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
        <Stat label='Registered users' value={users.length} />
        <Stat label='Completed all 9' value={done} hint={`${started} in progress`} />
        <Stat label='Open support requests' value={requests.filter((r) => r.status === 'open').length} />
        <Stat label='Avg. feedback rating' value={avg} hint={`${feedback.length} reviews`} />
      </div>
      <div style={C.card} className='p-4'>
        <h3 className='font-semibold mb-3'>Users by modules completed</h3>
        {dist.map((n, i) => (
          <div key={i} className='flex items-center gap-2 mb-1 text-sm'>
            <div className='w-20' style={C.muted}>{i === 0 ? 'Not started' : i === 9 ? 'All 9 ✅' : `${i} done`}</div>
            <div className='flex-1 rounded' style={{ backgroundColor: 'var(--qa-surface3)', height: 14 }}>
              <div style={{ width: `${(n / max) * 100}%`, backgroundColor: 'var(--qa-primary)', height: 14, borderRadius: 4 }} />
            </div>
            <div className='w-8 text-right'>{n}</div>
          </div>
        ))}
      </div>
      <div style={C.card} className='p-4'>
        <h3 className='font-semibold mb-2'>Latest sign-ups</h3>
        {recent.length === 0 && <div style={C.muted}>No users yet.</div>}
        {recent.map((u) => (
          <div key={u.id} className='text-sm py-1'>{u.name || '(no name)'} — {u.email} <span style={C.muted}>· {fmtDate(u.createdAt)}</span></div>
        ))}
      </div>
    </div>
  );
};

/* ===================== Users ===================== */
const Pre = ({ data }) => (
  <pre className='text-xs p-2 rounded overflow-auto' style={{ backgroundColor: 'var(--qa-surface2)', maxHeight: 220 }}>{JSON.stringify(data, null, 2)}</pre>
);

const UserEditor = ({ u, onClose }) => {
  const [wallet, setWallet] = useState(u.walletAddress || '');
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState(null);
  const sec = (u.up && u.up.section) || {};

  const run = async (fn, okMsg) => {
    setBusy(true);
    try {
      await fn();
      if (okMsg) toast.success(okMsg);
    } catch (e) {
      console.log(e);
      toast.error(e.message || e.code || 'Action failed');
    } finally {
      setBusy(false);
    }
  };
  const call = (name, label, confirmMsg) => {
    if (confirmMsg && !window.confirm(confirmMsg)) return;
    run(async () => setInfo({ label, data: await callAdmin(name, { email: u.email }) }), `${label}: done`);
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4' style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} onClick={onClose}>
      <div className='w-full max-w-lg max-h-[90dvh] overflow-y-auto p-5 space-y-3' style={{ ...C.card }} onClick={(e) => e.stopPropagation()}>
        <div className='flex justify-between items-start'>
          <div>
            <h3 className='text-lg font-bold'>{u.name || '(no name)'}</h3>
            <div className='text-sm'>{u.email}</div>
            <div className='text-xs' style={C.muted}>Joined {fmtDate(u.createdAt)} · Last seen {fmtDate(u.lastSeenAt)}</div>
          </div>
          <button type='button' onClick={onClose} className='text-2xl leading-none'>×</button>
        </div>

        <div className='p-2 rounded text-sm space-y-0.5' style={{ backgroundColor: 'var(--qa-surface2)' }}>
          <div><b>Modules completed (server record):</b> {(sec.completedModules || []).length}/9 {sec.completedModules && sec.completedModules.length ? `(${sec.completedModules.join(', ')})` : ''}</div>
          <div>All completed: {sec.allCompleted ? 'yes' : 'no'} · “Mint All” pressed: {sec.mintStarted ? 'yes' : 'no'} · Certificate minted: {sec.certificateMinted ? 'yes' : 'no'} · All minted: {sec.allMinted ? 'yes' : 'no'}</div>
          {!u.up && <div style={C.muted}>No server progress record yet (hasn’t finished a module).</div>}
          <div className='text-xs' style={C.muted}>Progress is read-only here: it is written only by the quiz → scoreboard → minting pipeline, so it can’t be edited by hand.</div>
        </div>

        <label className='block text-sm font-semibold'>Wallet address (OP Sepolia)
          <input style={C.input} value={wallet} onChange={(e) => setWallet(e.target.value)} placeholder='0x…' />
        </label>
        <button type='button' disabled={busy} style={C.btn} onClick={() => run(() => callAdmin('adminSetWallet', { email: u.email, walletAddress: wallet.trim() }), 'Wallet updated')}>Save wallet (validated)</button>
        <hr />
        <div className='text-sm font-semibold'>Minting & rewards</div>
        <div className='flex gap-2 flex-wrap'>
          <button type='button' disabled={busy} style={C.btnGhost} onClick={() => call('getUserProgressAdmin', 'Full status')}>Full status</button>
          <button type='button' disabled={busy} style={C.btnGhost} onClick={() => call('getLotusRewardStatus', 'LOTUS status')}>LOTUS status</button>
          <button type='button' disabled={busy} style={C.btnGhost} onClick={() => call('resetMintStarted', 'Reset “Mint All” lock', `Let ${u.email} press “Mint All” again?`)}>Reset “Mint All” lock</button>
          <button type='button' disabled={busy} style={C.btnGhost} onClick={() => call('retryLotusReward', 'Retry LOTUS', `Retry the LOTUS reward for ${u.email}?`)}>Retry LOTUS</button>
          <button type='button' disabled={busy} style={C.btnDanger} onClick={() => call('manuallyTriggerMint', 'Manual mint', `Queue ON-CHAIN minting of NFTs + certificate for ${u.email}? It uses the wallet shown above.`)}>Manually trigger mint</button>
        </div>
        {info && <div><div className='text-xs font-semibold mb-1'>{info.label}</div><Pre data={info.data} /></div>}
        <hr />
        <button type='button' disabled={busy} style={C.btnGhost} onClick={() => run(() => sendReset(u.email), 'Password reset email sent')}>Send password reset email</button>
      </div>
    </div>
  );
};

const Users = ({ users }) => {
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('all');
  const [sel, setSel] = useState(null);
  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    return users
      .filter((u) => !t || `${u.name} ${u.email} ${u.walletAddress}`.toLowerCase().includes(t))
      .filter((u) => {
        const p = Number(u.progress) || 0;
        return filter === 'all' || (filter === 'done' && p >= 9) || (filter === 'progress' && p > 0 && p < 9) || (filter === 'new' && p === 0) || (filter === 'nowallet' && !u.walletAddress);
      })
      .sort((a, b) => (tsToDate(b.createdAt)?.getTime() || 0) - (tsToDate(a.createdAt)?.getTime() || 0));
  }, [users, q, filter]);
  const selected = sel && users.find((u) => u.id === sel);

  return (
    <div className='space-y-3'>
      <div className='flex gap-2 flex-wrap'>
        <input style={{ ...C.input, maxWidth: 320 }} placeholder='Search name, email or wallet…' value={q} onChange={(e) => setQ(e.target.value)} />
        <select style={{ ...C.input, maxWidth: 200 }} value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value='all'>All users</option>
          <option value='new'>Not started</option>
          <option value='progress'>In progress</option>
          <option value='done'>Completed all 9</option>
          <option value='nowallet'>No wallet address</option>
        </select>
        <button type='button' style={C.btnGhost} onClick={() => csvDownload('users.csv', [['Name', 'Email', 'Wallet', 'Modules done', 'Joined', 'Last seen'], ...rows.map((u) => [u.name, u.email, u.walletAddress, Number(u.progress) || 0, fmtDate(u.createdAt), fmtDate(u.lastSeenAt)])])}>Export CSV ({rows.length})</button>
      </div>
      <div style={C.card} className='overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead><tr style={{ backgroundColor: 'var(--qa-surface3)' }}>{['Name', 'Email', 'Wallet', 'Progress', 'Minted', 'Joined'].map((h) => <th key={h} className='text-left p-2'>{h}</th>)}</tr></thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.id} onClick={() => setSel(u.id)} className='cursor-pointer' style={{ borderTop: '1px solid var(--qa-border)' }}>
                <td className='p-2'>{u.name || '—'}</td>
                <td className='p-2'>{u.email}</td>
                <td className='p-2 font-mono text-xs'>{u.walletAddress ? `${u.walletAddress.slice(0, 8)}…${u.walletAddress.slice(-4)}` : <span style={{ color: 'var(--qa-danger-text)' }}>missing</span>}</td>
                <td className='p-2'>{Number(u.progress) || 0}/9</td>
                <td className='p-2'>{u.up && u.up.section && u.up.section.allMinted ? '✅' : u.up && u.up.section && u.up.section.mintStarted ? '⏳' : '—'}</td>
                <td className='p-2'>{fmtDate(u.createdAt)}</td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td className='p-4' colSpan={6} style={C.muted}>No users match.</td></tr>}
          </tbody>
        </table>
      </div>
      {selected && <UserEditor key={selected.id} u={selected} onClose={() => setSel(null)} />}
    </div>
  );
};

/* ===================== Support ===================== */
const Support = ({ requests }) => {
  const [filter, setFilter] = useState('open');
  const [sel, setSel] = useState(null);
  const [reply, setReply] = useState('');
  const [asFaq, setAsFaq] = useState(false);
  const list = requests
    .filter((r) => filter === 'all' || r.status === filter)
    .sort((a, b) => (tsToDate(b.createdAt)?.getTime() || 0) - (tsToDate(a.createdAt)?.getTime() || 0));
  const r = sel && requests.find((x) => x.id === sel);

  const pick = (x) => { setSel(x.id); setReply(x.adminReply || ''); setAsFaq(false); };
  const save = async (status) => {
    try {
      await updateSupportRequest(r.id, { status, adminReply: reply.trim(), seenByUser: !reply.trim(), repliedAt: new Date() });
      if (asFaq && reply.trim()) {
        const words = r.message.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w.length > 3);
        await addFaq({ question: r.message.slice(0, 120), answer: reply.trim(), keywords: [...new Set(words)].slice(0, 12) });
      }
      toast.success('Saved');
    } catch (e) { toast.error(e.code || e.message); }
  };

  return (
    <div className='grid md:grid-cols-2 gap-3'>
      <div className='space-y-2'>
        <select style={{ ...C.input, maxWidth: 200 }} value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value='open'>Open</option><option value='in-progress'>In progress</option><option value='resolved'>Resolved</option><option value='all'>All</option>
        </select>
        {list.length === 0 && <div style={C.muted}>Nothing here 🎉</div>}
        {list.map((x) => (
          <button key={x.id} type='button' onClick={() => pick(x)} className='w-full text-left p-3' style={{ ...C.card, borderColor: sel === x.id ? 'var(--qa-primary)' : 'var(--qa-border)', borderWidth: sel === x.id ? 2 : 1 }}>
            <div className='flex justify-between text-xs' style={C.muted}><span>{x.category}</span><span>{fmtDate(x.createdAt)}</span></div>
            <div className='font-semibold text-sm'>{x.name || x.email}</div>
            <div className='text-sm truncate'>{x.message}</div>
            <div className='text-xs mt-1' style={{ color: x.status === 'open' ? 'var(--qa-danger-text)' : x.status === 'resolved' ? 'var(--qa-ok)' : 'var(--qa-pending)' }}>● {x.status}</div>
          </button>
        ))}
      </div>
      {r ? (
        <div style={C.card} className='p-4 space-y-2 self-start'>
          <div className='text-sm'><b>{r.name || '—'}</b> · {r.email}</div>
          <div className='text-xs' style={C.muted}>{r.category} · from {r.page} · {r.progress ?? 0}/9 modules done · {fmtDate(r.createdAt)}</div>
          <p className='text-sm whitespace-pre-wrap p-2 rounded' style={{ backgroundColor: 'var(--qa-surface2)' }}>{r.message}</p>
          <label className='block text-sm font-semibold'>Reply (shown to the user in the assistant next time they visit)
            <textarea rows={4} style={C.input} value={reply} onChange={(e) => setReply(e.target.value)} />
          </label>
          <label className='flex items-center gap-2 text-sm'><input type='checkbox' checked={asFaq} onChange={(e) => setAsFaq(e.target.checked)} /> Also teach this answer to the chatbot</label>
          <div className='flex gap-2 flex-wrap'>
            <button type='button' style={C.btn} onClick={() => save('resolved')}>Save & resolve</button>
            <button type='button' style={C.btnGhost} onClick={() => save('in-progress')}>Mark in progress</button>
            <a style={C.btnGhost} href={`mailto:${r.email}?subject=${encodeURIComponent('Your 1Billion2Web3 request')}&body=${encodeURIComponent(reply)}`}>Email user</a>
            <button type='button' style={C.btnDanger} onClick={() => window.confirm('Delete this request?') && deleteSupportRequest(r.id).then(() => setSel(null))}>Delete</button>
          </div>
        </div>
      ) : <div style={C.muted}>Select a request to view and reply.</div>}
    </div>
  );
};

/* ===================== Feedback ===================== */
const Feedback = ({ feedback }) => {
  const list = [...feedback].sort((a, b) => (tsToDate(b.createdAt)?.getTime() || 0) - (tsToDate(a.createdAt)?.getTime() || 0));
  return (
    <div className='space-y-2'>
      <button type='button' style={C.btnGhost} onClick={() => csvDownload('feedback.csv', [['Name', 'Email', 'Rating', 'Comment', 'Date'], ...list.map((f) => [f.name, f.email, f.rating, f.comment, fmtDate(f.createdAt)])])}>Export CSV</button>
      {list.length === 0 && <div style={C.muted}>No reviews yet. They appear after learners finish all 9 modules.</div>}
      {list.map((f) => (
        <div key={f.id} style={C.card} className='p-3'>
          <div className='flex justify-between text-sm'><b>{f.name || f.email}</b><span style={{ color: '#f59e0b' }}>{'★'.repeat(f.rating || 0)}<span style={{ color: 'var(--qa-star-off)' }}>{'★'.repeat(5 - (f.rating || 0))}</span></span></div>
          <div className='text-sm whitespace-pre-wrap'>{f.comment || <i style={C.muted}>(no comment)</i>}</div>
          <div className='text-xs' style={C.muted}>{f.email} · {fmtDate(f.createdAt)}</div>
        </div>
      ))}
    </div>
  );
};

/* ===================== Bot answers ===================== */
const BotAnswers = ({ faqs }) => {
  const [f, setF] = useState({ question: '', keywords: '', answer: '' });
  const add = async (e) => {
    e.preventDefault();
    try {
      await addFaq({ question: f.question.trim(), answer: f.answer.trim(), keywords: f.keywords.split(',').map((k) => k.trim().toLowerCase()).filter(Boolean) });
      setF({ question: '', keywords: '', answer: '' });
      toast.success('Added');
    } catch (err) { toast.error(err.code || err.message); }
  };
  return (
    <div className='space-y-3'>
      <form onSubmit={add} style={C.card} className='p-4 space-y-2'>
        <h3 className='font-semibold'>Teach the chatbot a new answer</h3>
        <input style={C.input} placeholder='Question (e.g. When does the next cohort start?)' value={f.question} onChange={(e) => setF({ ...f, question: e.target.value })} required />
        <input style={C.input} placeholder='Keywords, comma-separated (e.g. cohort, next, start)' value={f.keywords} onChange={(e) => setF({ ...f, keywords: e.target.value })} required />
        <textarea style={C.input} rows={3} placeholder='Answer' value={f.answer} onChange={(e) => setF({ ...f, answer: e.target.value })} required />
        <button type='submit' style={C.btn}>Add answer</button>
        <p className='text-xs' style={C.muted}>Never put quiz answers here — the assistant is meant to stay out of the quizzes.</p>
      </form>
      {faqs.map((x) => (
        <div key={x.id} style={C.card} className='p-3 flex justify-between gap-3'>
          <div><div className='font-semibold text-sm'>{x.question}</div><div className='text-sm'>{x.answer}</div><div className='text-xs' style={C.muted}>{(x.keywords || []).join(', ')}</div></div>
          <button type='button' style={C.btnDanger} onClick={() => deleteFaq(x.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};


/* ===================== AI knowledge ===================== */
const KNOWLEDGE_LIMIT = 40000;
const AIKnowledge = ({ entries, settingsDocs }) => {
  const settings = settingsDocs.find((d) => d.id === 'main') || {};
  const enabled = settings.enabled !== false;
  const [instructions, setInstructions] = useState('');
  const [loadedSettings, setLoadedSettings] = useState(false);
  const [editId, setEditId] = useState(null);
  const [f, setF] = useState({ title: '', content: '' });
  const [testQ, setTestQ] = useState('');
  const [testA, setTestA] = useState('');
  const [testing, setTesting] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    if (!loadedSettings && settingsDocs.length) { setInstructions(settings.instructions || ''); setLoadedSettings(true); }
  }, [settingsDocs, loadedSettings, settings.instructions]);

  const total = entries.reduce((n, e) => n + (e.title || '').length + (e.content || '').length, 0);

  const save = async (e) => {
    e.preventDefault();
    try {
      await saveKnowledge(editId, { title: f.title.trim(), content: f.content.trim() });
      setF({ title: '', content: '' }); setEditId(null);
      toast.success('Knowledge saved — the AI uses it immediately');
    } catch (err) { toast.error(err.code || err.message); }
  };
  const importFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = () => setF({ title: f.title || file.name.replace(/\.[^.]+$/, ''), content: String(r.result || '') });
    r.readAsText(file);
    e.target.value = '';
  };
  const runTest = async (e) => {
    e.preventDefault();
    setTesting(true); setTestA('');
    try {
      const r = await askAI(auth.currentUser, [{ role: 'user', content: testQ }]);
      setTestA(r.disabled ? '(AI is switched off)' : r.noAnswer ? '(No answer found in the knowledge → learners would be offered the “send to the team” form)' : r.reply);
    } catch (err) {
      setTestA(`Error: ${err.detail || err.message}. ${err.status === 404 ? 'The /api route only exists on Vercel (or "vercel dev"), not "yarn dev".' : ''}`);
    } finally { setTesting(false); }
  };

  return (
    <div className='space-y-4'>
      <div style={C.card} className='p-4 space-y-2'>
        <div className='flex items-center justify-between gap-2 flex-wrap'>
          <h3 className='font-semibold'>AI assistant settings</h3>
          <label className='flex items-center gap-2 text-sm font-semibold'>
            <input type='checkbox' checked={enabled} onChange={(e) => saveBotSettings({ enabled: e.target.checked }).then(() => toast.success(e.target.checked ? 'AI on' : 'AI off — chatbot uses basic built-in answers'))} />
            AI enabled
          </label>
        </div>
        <label className='block text-sm font-semibold'>Style notes (optional, e.g. “Be upbeat, use simple English, address learners by first name”)
          <textarea rows={2} style={C.input} value={instructions} onChange={(e) => setInstructions(e.target.value)} />
        </label>
        <button type='button' style={C.btn} onClick={() => saveBotSettings({ instructions: instructions.trim() }).then(() => toast.success('Saved'))}>Save notes</button>
      </div>

      <form onSubmit={save} style={C.card} className='p-4 space-y-2'>
        <h3 className='font-semibold'>{editId ? 'Edit knowledge entry' : 'Add knowledge'}</h3>
        <input style={C.input} placeholder='Title (e.g. About the 1Billion2Web3 Initiative)' value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} required />
        <textarea style={C.input} rows={8} placeholder='Paste facts the AI may use: mission, programme schedule, how modules/NFTs/certificates work, FAQs, contacts…' value={f.content} onChange={(e) => setF({ ...f, content: e.target.value })} required />
        <div className='flex gap-2 flex-wrap'>
          <button type='submit' style={C.btn}>{editId ? 'Update entry' : 'Add entry'}</button>
          <button type='button' style={C.btnGhost} onClick={() => fileRef.current && fileRef.current.click()}>Import .txt / .md file</button>
          {editId && <button type='button' style={C.btnGhost} onClick={() => { setEditId(null); setF({ title: '', content: '' }); }}>Cancel edit</button>}
          <input ref={fileRef} type='file' accept='.txt,.md,text/plain,text/markdown' className='hidden' onChange={importFile} />
        </div>
        <p className='text-xs' style={C.muted}>
          The AI answers only from this knowledge. <b>Do not include quiz answers</b> or secrets (learners’ apps can read this collection). PDFs/Word: copy the text in.
        </p>
      </form>

      <div style={C.card} className='p-4 space-y-2'>
        <div className='flex justify-between text-sm'>
          <h3 className='font-semibold'>Knowledge entries ({entries.length})</h3>
          <span style={{ color: total > KNOWLEDGE_LIMIT ? 'var(--qa-danger-text)' : 'var(--qa-muted)' }}>{total.toLocaleString()} / {KNOWLEDGE_LIMIT.toLocaleString()} characters{total > KNOWLEDGE_LIMIT ? ' — extra text is ignored' : ''}</span>
        </div>
        {entries.length === 0 && <div style={C.muted}>Nothing yet — until you add knowledge, the AI says it has no answer and learners are offered the “contact the team” form.</div>}
        {entries.map((e) => (
          <div key={e.id} className='p-2 rounded flex justify-between gap-2' style={{ backgroundColor: 'var(--qa-surface2)' }}>
            <div className='min-w-0'>
              <div className='font-semibold text-sm'>{e.title}</div>
              <div className='text-xs truncate' style={C.muted}>{(e.content || '').slice(0, 140)}</div>
              <div className='text-xs' style={C.muted}>Updated {fmtDate(e.updatedAt)}</div>
            </div>
            <div className='flex gap-1 shrink-0'>
              <button type='button' style={C.btnGhost} onClick={() => { setEditId(e.id); setF({ title: e.title || '', content: e.content || '' }); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Edit</button>
              <button type='button' style={C.btnDanger} onClick={() => window.confirm(`Delete “${e.title}”?`) && deleteKnowledge(e.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={runTest} style={C.card} className='p-4 space-y-2'>
        <h3 className='font-semibold'>Try the AI</h3>
        <div className='flex gap-2'>
          <input style={C.input} placeholder='Ask something a learner might ask…' value={testQ} onChange={(e) => setTestQ(e.target.value)} required />
          <button type='submit' disabled={testing} style={C.btn}>{testing ? '…' : 'Ask'}</button>
        </div>
        {testA && <p className='text-sm whitespace-pre-wrap p-2 rounded' style={{ backgroundColor: 'var(--qa-surface2)' }}>{testA}</p>}
      </form>
    </div>
  );
};


/* ===================== Minting & LOTUS (uses your existing admin callables) ===================== */
const Minting = () => {
  const [q, setQ] = useState(null);
  const [lotus, setLotus] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setBusy(true);
    try { setQ(await callAdmin('getMintQueueStatus')); } catch (e) { toast.error(`Mint queue: ${e.message}`); }
    try { setLotus(await callAdmin('getLotusStats')); } catch (e) { toast.error(`LOTUS stats: ${e.message}`); }
    setBusy(false);
  };
  useEffect(() => { load(); }, []);

  const act = async (name, confirmMsg) => {
    if (!window.confirm(confirmMsg)) return;
    try {
      const r = await callAdmin(name);
      toast.success(`Retried ${r.retriedCount ?? 0} item(s)`);
      load();
    } catch (e) { toast.error(e.message); }
  };
  const sum = (q && q.summary) || {};
  const lotusRows = lotus ? Object.entries(lotus).filter(([k]) => k !== 'success') : [];

  return (
    <div className='space-y-4'>
      <div className='flex gap-2 flex-wrap'>
        <button type='button' style={C.btn} disabled={busy} onClick={load}>{busy ? 'Loading…' : 'Refresh'}</button>
        <button type='button' style={C.btn} onClick={() => act('requeueStalledMints', 'Restart mint jobs that got stuck after a failed attempt? They will be minted again with the current code.')}>Restart stalled jobs</button>
        <button type='button' style={C.btnGhost} onClick={() => act('retryFailedMints', 'Reset ALL failed mint jobs to pending so they are retried?')}>Retry all failed mints</button>
        <button type='button' style={C.btnGhost} onClick={() => act('retryFailedLotusRewards', 'Reset ALL failed LOTUS rewards to pending so they are retried?')}>Retry all failed LOTUS</button>
      </div>
      <div className='grid grid-cols-2 md:grid-cols-5 gap-3'>
        {['pending', 'processing', 'failed', 'success', 'total'].map((k) => <Stat key={k} label={`Mint jobs: ${k}`} value={sum[k] ?? '—'} />)}
      </div>
      <div style={C.card} className='p-4'>
        <h3 className='font-semibold mb-2'>Failed mint jobs</h3>
        {!q || !(q.failedJobs || []).length ? <div style={C.muted}>None 🎉</div> : (
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead><tr style={{ backgroundColor: 'var(--qa-surface3)' }}>{['Email', 'Type', 'Module', 'Attempts', 'Error'].map((h) => <th key={h} className='text-left p-2'>{h}</th>)}</tr></thead>
              <tbody>{q.failedJobs.map((j) => (
                <tr key={j.id} style={{ borderTop: '1px solid var(--qa-border)' }}>
                  <td className='p-2'>{j.email}</td><td className='p-2'>{j.type}</td><td className='p-2'>{j.moduleNumber ?? '—'}</td><td className='p-2'>{j.attempts}</td>
                  <td className='p-2 text-xs' style={{ color: 'var(--qa-danger-text)' }}>{String(j.error || '').slice(0, 160)}</td>
                </tr>))}</tbody>
            </table>
          </div>
        )}
      </div>
      <div style={C.card} className='p-4'>
        <h3 className='font-semibold mb-2'>LOTUS rewards</h3>
        {!lotus ? <div style={C.muted}>—</div> : lotusRows.map(([k, v]) => (
          <div key={k} className='text-sm flex justify-between gap-3 py-0.5' style={{ borderTop: '1px solid var(--qa-surface3)' }}>
            <span style={C.muted}>{k}</span><span className='font-mono text-xs text-right break-all'>{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ===================== Admins ===================== */
const Admins = ({ admins, me }) => {
  const [email, setEmail] = useState('');
  return (
    <div className='space-y-3 max-w-xl'>
      <form className='flex gap-2' onSubmit={(e) => { e.preventDefault(); addAdmin(email, me).then(() => { setEmail(''); toast.success('Admin added'); }).catch((er) => toast.error(er.code || er.message)); }}>
        <input type='email' required style={C.input} placeholder='new-admin@email.com' value={email} onChange={(e) => setEmail(e.target.value)} />
        <button type='submit' style={C.btn}>Add</button>
      </form>
      {admins.map((a) => (
        <div key={a.id} style={C.card} className='p-3 flex justify-between items-center text-sm'>
          <span>{a.email || a.id}</span>
          {norm(a.id) !== norm(me) ? <button type='button' style={C.btnDanger} onClick={() => window.confirm(`Remove ${a.id} as admin?`) && removeAdmin(a.id)}>Remove</button> : <span style={C.muted}>you</span>}
        </div>
      ))}
    </div>
  );
};

/* ===================== Shell ===================== */
const AdminPage = () => {
  const navigate = useNavigate();
  const { user, ready } = useAuthUser();
  const [access, setAccess] = useState(null); // null | 'admin' | 'pending' | 'none'
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    if (!ready) return;
    if (!user) { navigate('/login'); return; }
    getAdminState(user).then(setAccess);
  }, [ready, user, navigate]);

  if (!ready || access === null) return <div style={{ ...C.page, padding: 24 }}>Checking access…</div>;
  if (access !== 'admin') {
    return (
      <div style={{ ...C.page, padding: 24 }}>
        <h2 className='text-xl font-bold mb-2'>{access === 'pending' ? 'Almost there' : 'Admins only'}</h2>
        <p className='mb-3'>
          {access === 'pending'
            ? 'You are on the admin list, but your admin permission hasn’t reached this login yet. Log out, log back in, and open /admin again. (If it still fails, the onAdminAdded function may not be deployed.)'
            : 'Your account doesn’t have admin access.'}
        </p>
        <Link to='/dashboard' style={C.btn}>Back to dashboard</Link>
      </div>
    );
  }
  return <AdminInner me={user.email} tab={tab} setTab={setTab} navigate={navigate} />;
};

const AdminInner = ({ me, tab, setTab, navigate }) => {
  const [rawUsers, usersLoaded] = useCollection('users');
  const [userProgress] = useCollection('userProgress');
  const users = useMemo(() => {
    const m = {};
    userProgress.forEach((p) => { m[norm(p.id)] = p; });
    return rawUsers.map((u) => {
      const up = m[norm(u.email)];
      const done = up && up.section && Array.isArray(up.section.completedModules) ? up.section.completedModules.length : Number(u.progress) || 0;
      return { ...u, up, progress: done, walletAddress: (up && up.walletAddress) || u.walletAddress };
    });
  }, [rawUsers, userProgress]);
  const [requests] = useCollection('supportRequests', (r) => {
    if (r.status === 'open') toast.info(`🔔 New support request from ${r.name || r.email}: ${(r.message || '').slice(0, 60)}`, { autoClose: 8000 });
  });
  const [feedback] = useCollection('feedback');
  const [faqs] = useCollection('botFaqs');
  const [knowledge] = useCollection('botKnowledge');
  const [botSettings] = useCollection('botSettings');
  const [admins] = useCollection('admins');
  const openCount = requests.filter((r) => r.status === 'open').length;

  useEffect(() => {
    document.title = openCount ? `(${openCount}) Admin · 1Billion2Web3` : 'Admin · 1Billion2Web3';
  }, [openCount]);

  const tabs = [
    ['overview', 'Overview'], ['users', `Users (${users.length})`], ['support', `Support${openCount ? ` 🔴${openCount}` : ''}`],
    ['feedback', `Feedback (${feedback.length})`], ['minting', 'Minting & LOTUS'], ['ai', 'AI knowledge'], ['bot', 'Saved answers'], ['admins', 'Admins'],
  ];
  return (
    <div style={C.page}>
      <div className='flex flex-wrap items-center justify-between gap-2 px-4 pb-3' style={{ backgroundColor: 'var(--qa-header)', color: '#fff', paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}>
        <h1 className='font-bold text-lg'>1Billion2Web3 · Admin</h1>
        <div className='flex items-center gap-2 text-sm'>
          <span className='hidden sm:inline truncate max-w-[220px]'>{me}</span>
          <ThemeToggle className='text-white' />
          <Link to='/dashboard' style={{ ...C.btnGhost, padding: '4px 10px' }}>Learner view</Link>
          <button type='button' style={{ ...C.btnGhost, padding: '4px 10px' }} onClick={() => signOut(auth).then(() => navigate('/'))}>Logout</button>
        </div>
      </div>
      <div className='flex gap-1 overflow-x-auto px-4 pt-3'>
        {tabs.map(([k, label]) => (
          <button key={k} type='button' onClick={() => setTab(k)} className='whitespace-nowrap' style={{ ...(tab === k ? C.btn : C.btnGhost) }}>{label}</button>
        ))}
      </div>
      <div className='p-4'>
        {!usersLoaded && <div style={C.muted}>Loading…</div>}
        {tab === 'overview' && <Overview users={users} requests={requests} feedback={feedback} />}
        {tab === 'users' && <Users users={users} />}
        {tab === 'support' && <Support requests={requests} />}
        {tab === 'feedback' && <Feedback feedback={feedback} />}
        {tab === 'minting' && <Minting />}
        {tab === 'ai' && <AIKnowledge entries={knowledge} settingsDocs={botSettings} />}
        {tab === 'bot' && <BotAnswers faqs={faqs} />}
        {tab === 'admins' && <Admins admins={admins} me={me} />}
      </div>
    </div>
  );
};

export default AdminPage;
