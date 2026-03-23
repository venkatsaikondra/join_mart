'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import styles from './Home.module.css';

// Lottie type (loaded dynamically to avoid SSR issues)
type LottiePlayer = {
  loadAnimation: (config: {
    container: HTMLElement;
    renderer: string;
    loop: boolean;
    autoplay: boolean;
    path: string;
  }) => { destroy: () => void };
};

// ── Ticker items ────────────────────────────────────────────
const TICKER_ITEMS = [
  'Create Room', 'Share Code', 'Upload Products',
  'Hold Items', 'Real-Time Updates', 'Mark Sold',
  'Private & Secure', 'Zero Public Listings',
];

// ── Feature data ────────────────────────────────────────────
const FEATURES = [
  {
    num: '01',
    title: 'Invite-Only Rooms',
    desc: 'Generate a 6-digit code. Only the people you share it with can enter. No public discovery, no uninvited guests.',
  },
  {
    num: '02',
    title: 'Live Status Board',
    desc: 'Every item shows its real-time status — Available, Held, or Sold. Everyone in the room sees updates the moment they happen.',
  },
  {
    num: '03',
    title: 'One-Tap Holding',
    desc: 'Buyers tap Hold to reserve an item. Vendors confirm or release. No DMs, no confusion, no double-selling.',
  },
];

// ── Step data ───────────────────────────────────────────────
const STEPS = [
  {
    id: 'lottie-step1',
    num: '01',
    title: 'Create Your Room',
    desc: 'Enter a room name, pick your role as vendor or buyer, and get a unique 6-digit code generated instantly.',
    path: 'https://assets10.lottiefiles.com/packages/lf20_ydo1amjm.json',
  },
  {
    id: 'lottie-step2',
    num: '02',
    title: 'Share the Code',
    desc: 'Send the 6-digit code via WhatsApp, Instagram, or any channel. Your people enter the code to join.',
    path: 'https://assets3.lottiefiles.com/packages/lf20_u4yrau84.json',
  },
  {
    id: 'lottie-step3',
    num: '03',
    title: 'Trade in Real Time',
    desc: 'Upload products with photos and prices. Buyers hold items. Vendor marks them sold. Everyone stays in sync.',
    path: 'https://assets2.lottiefiles.com/packages/lf20_jfe6ciok.json',
  },
];

const INITIAL_CODE = ['4', '8', '2', '9', '1', '7'];

export default function Home() {
  const [codeDigits, setCodeDigits] = useState(INITIAL_CODE);
  const heroLottieRef   = useRef<HTMLDivElement>(null);
  const featureLottieRef = useRef<HTMLDivElement>(null);
  const featureItemRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const stepCardRefs     = useRef<(HTMLDivElement | null)[]>([]);

  // ── Load Lottie dynamically (SSR-safe) ──────────────────────
  useEffect(() => {
    let instances: Array<{ destroy: () => void }> = [];

    import('lottie-web').then((lottieModule) => {
      const lottie = lottieModule.default as LottiePlayer;

      if (heroLottieRef.current) {
        instances.push(lottie.loadAnimation({
          container: heroLottieRef.current,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: 'https://assets9.lottiefiles.com/packages/lf20_jcikwtux.json',
        }));
      }

      if (featureLottieRef.current) {
        instances.push(lottie.loadAnimation({
          container: featureLottieRef.current,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: 'https://assets4.lottiefiles.com/packages/lf20_qp1q7mct.json',
        }));
      }

      STEPS.forEach((step) => {
        const el = document.getElementById(step.id);
        if (el) {
          instances.push(lottie.loadAnimation({
            container: el,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: step.path,
          }));
        }
      });
    });

    return () => instances.forEach((i) => i.destroy());
  }, []);

  // ── Intersection observer for scroll animations ─────────────
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, idx) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add(styles.visible), idx * 130);
          }
        });
      },
      { threshold: 0.15 }
    );

    [...featureItemRefs.current, ...stepCardRefs.current]
      .filter(Boolean)
      .forEach((el) => observer.observe(el!));

    return () => observer.disconnect();
  }, []);

  // ── Randomise CTA code digits ────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setCodeDigits((prev) => {
        const next = [...prev];
        const idx = Math.floor(Math.random() * next.length);
        next[idx] = String(Math.floor(Math.random() * 10));
        return next;
      });
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* ── NAVBAR ─────────────────────────────────────────── */}
      <nav className={styles.nav}>
        <Link href="/" className={styles.navLogo}>BAZAAR</Link>
        <div className={styles.navLinks}>
          <Link href="/about" className={styles.navBtnGhost}>About</Link>
          <a href="#how" className={styles.navBtnGhost}>How It Works</a>
          <Link href="/create" className={styles.navBtn}>Create Room</Link>
          <div className={styles.navAvatar} title="Account">👤</div>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroGrid} />
        <div className={styles.heroOrb1} />
        <div className={styles.heroOrb2} />

        {/* Left */}
        <div className={styles.heroLeft}>
          <div className={styles.heroEyebrow}>
            <span className={styles.eyebrowPill}>NEW</span>
            Private Marketplace Rooms
          </div>

          <h1 className={styles.heroTitle}>
            TRADE
            <span className={styles.heroTitleViolet}>WITH YOUR</span>
            <span className={styles.heroTitleAccent}>CIRCLE</span>
            <span className={styles.heroTitleDim}>not the whole world</span>
          </h1>

          <p className={styles.heroSub}>
            Create a private room, share a 6-digit code, and buy or sell
            with people you trust — in real time. No public listings. No strangers.
          </p>

          <div className={styles.heroActions}>
            <Link href="/create" className={styles.btnPrimary}>✦ Create a Room</Link>
            <Link href="/join" className={styles.btnGhost}>⌗ Join with Code</Link>
          </div>
        </div>

        {/* Right — Lottie */}
        <div className={styles.heroRight}>
          <div className={styles.lottieWrap}>
            <div ref={heroLottieRef} className={styles.lottieHero} />

            <div className={`${styles.floatBadge} ${styles.floatBadge1}`}>
              <div className={styles.badgeLabel}>Room Code</div>
              <div className={styles.badgeValueViolet + ' ' + styles.badgeValue}>
                {INITIAL_CODE.join(' ')}
              </div>
            </div>

            <div className={`${styles.floatBadge} ${styles.floatBadge2}`}>
              <div className={styles.badgeLabel}>Status</div>
              <div className={styles.badgeValue}>LIVE ●</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER ─────────────────────────────────────────── */}
      <div className={styles.ticker}>
        <div className={styles.tickerTrack}>
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className={styles.tickerItem}>
              <span className={styles.tickerDot} />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── FEATURES ───────────────────────────────────────── */}
      <section className={styles.featuresSection}>
        <div className={styles.sectionLabel}>The Platform</div>
        <h2 className={styles.sectionTitle}>
          Ending "Stranger{' '}
          <span className={styles.sectionTitleEm}>Danger</span>" Selling.
        </h2>
        <p className={styles.sectionSub}>
          Bazaar solves the trust problem in peer-to-peer selling — having
          buyers you don't know competing for your items, ghosting you, or
          creating confusion. Real-time. Invite-only. Yours.
        </p>

        <div className={styles.featuresWrap}>
          {/* Feature list */}
          <div className={styles.featureLeft}>
            <div className={styles.featureList}>
              {FEATURES.map((f, i) => (
                <div
                  key={f.num}
                  className={styles.featureItem}
                  ref={(el) => { featureItemRefs.current[i] = el; }}
                >
                  <div className={styles.featureNum}>{f.num}</div>
                  <div>
                    <h3 className={styles.featureTextTitle}>{f.title}</h3>
                    <p className={styles.featureTextDesc}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lottie panel */}
          <div className={styles.featureRight}>
            <div ref={featureLottieRef} className={styles.featureLottie} />
            <span className={styles.featureBadge}>✦ Real-time sync</span>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────── */}
      <section className={styles.howSection} id="how">
        <div className={styles.sectionLabel}>Simple Process</div>
        <h2 className={styles.sectionTitle}>
          Up & selling in{' '}
          <span className={styles.sectionTitleEm}>30 seconds.</span>
        </h2>

        <div className={styles.stepsGrid}>
          {STEPS.map((step, i) => (
            <div
              key={step.id}
              className={styles.stepCard}
              ref={(el) => { stepCardRefs.current[i] = el; }}
            >
              <span className={styles.stepNum}>{step.num}</span>
              <div id={step.id} className={styles.stepLottie} />
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>
          YOUR ROOM.<br />
          <span className={styles.ctaTitleAccent}>YOUR RULES.</span>
        </h2>
        <p className={styles.ctaSub}>
          Six digits. Infinite possibilities. Start your private marketplace in seconds.
        </p>
        <div className={styles.ctaActions}>
          <Link href="/create" className={styles.ctaBtnPrimary}>✦ Create a Room</Link>
          <Link href="/join" className={styles.ctaBtnGhost}>⌗ Join with Code</Link>
        </div>

        {/* Animated code preview */}
        <div className={styles.codePreview}>
          {codeDigits.map((d, i) => (
            <div key={i} className={styles.codeDigit}>{d}</div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <footer className={styles.footer}>
        <span className={styles.footerLogo}>BAZAAR</span>
        <div className={styles.footerLinks}>
          <Link href="/about" className={styles.footerLink}>About</Link>
          <a href="#how" className={styles.footerLink}>How It Works</a>
          <a href="#" className={styles.footerLink}>Privacy</a>
        </div>
        <span className={styles.footerCopy}>© 2025 Bazaar. Built with ✦</span>
      </footer>
    </>
  );
}