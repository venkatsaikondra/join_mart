import Link from 'next/link';
import styles from './Home.module.css';

export default function HomePage() {
  return (
    <main className={styles.page}>
      {/* Background layers */}
      <div className={styles.grid} />
      <div className={styles.orb1} />
      <div className={styles.orb2} />
      <div className={styles.noise} />
      <div className={styles.cornerTL} />
      <div className={styles.cornerBR} />

      <div className={styles.content}>
        <div className={styles.eyebrow}>
          <span className={styles.dot} />
          Private Marketplace Rooms
        </div>

        <h1 className={styles.title}>
          Trade with your{' '}
          <span className={styles.accent}>circle</span>
          <span className={styles.line2}>not the whole world</span>
        </h1>

        <p className={styles.subtitle}>
          Create a private room, share a 6-digit code, and buy or sell
          with people you trust — in real time.
        </p>

        <div className={styles.actions}>
          <Link href="/create" className={styles.btnPrimary}>
            <span className={styles.btnIcon}>✦</span>
            Create a Room
          </Link>
          <Link href="/join" className={styles.btnSecondary}>
            <span className={styles.btnIcon}>⌗</span>
            Join with Code
          </Link>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>6</span>
            <span className={styles.statLabel}>Digit Code</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.stat}>
            <span className={styles.statValue}>∞</span>
            <span className={styles.statLabel}>Products</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.stat}>
            <span className={styles.statValue}>⚡</span>
            <span className={styles.statLabel}>Real-time</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.stat}>
            <span className={styles.statValue}>0</span>
            <span className={styles.statLabel}>Public Listings</span>
          </div>
        </div>
      </div>
    </main>
  );
}