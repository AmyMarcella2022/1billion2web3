// Calls the Vercel function /api/chat with the learner's Firebase ID token.
export async function askAI(user, history) {
  const idToken = await user.getIdToken();
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
    body: JSON.stringify({ messages: history }),
  });
  if (!res.ok) {
    const err = new Error(`AI request failed (${res.status})`);
    err.status = res.status;
    try { err.detail = (await res.json()).error; } catch (e) { /* ignore */ }
    throw err;
  }
  return res.json(); // { reply } | { noAnswer: true } | { disabled: true }
}
