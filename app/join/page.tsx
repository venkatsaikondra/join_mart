'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function JoinPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) { setError('Please enter a valid 6-digit code.'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/room/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, name }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || 'Room not found. Check your code and try again.');
        return;
      }
      router.push(`/room/${code}`);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.bg} />
      <div className={styles.orb} />

      <div className={styles.card}>
        <Link href="/" className={styles.back}>← Back</Link>

        <div className={styles.iconWrap}>⌗</div>
        <h1 className={styles.title}>Join a Room</h1>
        <p className={styles.desc}>
          Enter the 6-digit code shared by your vendor to access the room.
        </p>

        <form className={styles.form} onSubmit={handleJoin}>
          <div className={styles.field}>
            <label className={styles.label}>Room Code</label>
            <input
              className={styles.codeInput}
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="——————"
              value={code}
              onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Your Name</label>
            <input
              className={styles.input}
              type="text"
              placeholder="e.g. Arjun"
              required
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button className={styles.submit} type="submit" disabled={loading}>
            {loading ? 'Joining…' : '⌗ Enter Room'}
          </button>
        </form>
      </div>
    </main>
  );
}