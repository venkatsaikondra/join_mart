'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function CreatePage() {
  const router = useRouter();
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [role, setRole] = useState<'vendor' | 'buyer'>('vendor');
  const [roomCode, setRoomCode] = useState('');
  const [form, setForm] = useState({ roomName: '', yourName: '', description: '' });
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/room/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, role }),
      });
      const data = await res.json();
      if (!res.ok || !data?.code) {
        throw new Error(data?.error || 'Failed to create room');
      }
      setRoomCode(data.code);
      setStep('success');
    } catch (error) {
      console.error('Room creation failed:', error);
      alert(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
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

        {step === 'form' ? (
          <>
            <div className={styles.header}>
              <div className={styles.iconWrap}>✦</div>
              <h1 className={styles.title}>Create a Room</h1>
              <p className={styles.desc}>
                Set up your private marketplace. Share the code with your circle.
              </p>
            </div>

            <form className={styles.form} onSubmit={handleCreate}>
              <div className={styles.field}>
                <label className={styles.label}>Your Role</label>
                <div className={styles.toggle}>
                  <button
                    type="button"
                    className={`${styles.toggleOption} ${role === 'vendor' ? styles.active : ''}`}
                    onClick={() => setRole('vendor')}
                  >
                    🛍 Vendor
                  </button>
                  <button
                    type="button"
                    className={`${styles.toggleOption} ${role === 'buyer' ? styles.active : ''}`}
                    onClick={() => setRole('buyer')}
                  >
                    👀 Buyer
                  </button>
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Room Name</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="e.g. Summer Closet Cleanout"
                  required
                  value={form.roomName}
                  onChange={e => setForm({ ...form, roomName: e.target.value })}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Your Name</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="e.g. Priya"
                  required
                  value={form.yourName}
                  onChange={e => setForm({ ...form, yourName: e.target.value })}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Description <span style={{ opacity: 0.4 }}>(optional)</span></label>
                <textarea
                  className={`${styles.input} ${styles.textarea}`}
                  placeholder="What are you selling? Any rules for the room?"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <button className={styles.submit} type="submit" disabled={loading}>
                {loading ? 'Creating…' : <>✦ Generate Room Code</>}
              </button>
            </form>
          </>
        ) : (
          <div className={styles.success}>
            <div className={styles.successIcon}>🎉</div>
            <h2 className={styles.successTitle}>Room Created!</h2>
            <p className={styles.successDesc}>Share this code with your circle to let them in.</p>
            <div className={styles.codeBox}>
              <span className={styles.codeLabel}>Your Room Code</span>
              <span className={styles.code}>{roomCode}</span>
            </div>
            <Link href={`/room/${roomCode}`} className={styles.enterBtn}>
              Enter Room →
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}