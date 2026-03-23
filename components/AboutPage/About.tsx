'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './About.module.css';

type LottiePlayer = {
  loadAnimation: (config: {
    container: HTMLElement;
    renderer: string;
    loop: boolean;
    autoplay: boolean;
    path: string;
  }) => { destroy: () => void };
};

// ── Mission features ────────────────────────────────────────
const MISSION_FEATURES = [
  {
    num: '01',
    title: 'Zero-Stranger Vision',
    desc: 'We help you sell only to people you choose — friends, community groups, or curated circles. Every room is 100% invite-only.',
  },
  {
    num: '02',
    title: 'Real-Time Clarity',
    desc: 'No more "Is it still available?" messages. Live status badges — Available, Held, Sold — keep every buyer informed the instant something changes.',
  },
  {
    num: '03',
    title: 'Instant Room Setup',
    desc: 'From "I have stuff to sell" to a live private marketplace in under 30 seconds. Generate a code, share it, and you\'re live.',
  },
];

// ── Values ──────────────────────────────────────────────────
const VALUES = [
  {
    id: 'lottie-val1',
    path: 'https://assets3.lottiefiles.com/packages/lf20_u4yrau84.json',
    title: 'Trust First',
    desc: 'Every design decision we make asks: does this make our users feel safer? Invite codes, status transparency, and vendor controls all exist to protect your experience.',
  },
  {
    id: 'lottie-val2',
    path: 'https://assets10.lottiefiles.com/packages/lf20_ydo1amjm.json',
    title: 'Speed Matters',
    desc: 'A room should be live before the buyer gets bored. A product should be listed before the mood passes. We obsess over reducing every unnecessary step.',
  },
  {
    id: 'lottie-val3',
    path: 'https://assets4.lottiefiles.com/packages/lf20_qp1q7mct.json',
    title: 'Clarity Wins',
    desc: 'Confusion kills deals. Live status badges, simple hold flows, and one-tap mark-as-sold keep everyone on the same page — always.',
  },
];

export default function About() {
  const artLottieRef     = useRef<HTMLDivElement>(null);
  const missionLottieRef = useRef<HTMLDivElement>(null);
  const decorLottieRef   = useRef<HTMLDivElement>(null);
  const storyLottieRef   = useRef<HTMLDivElement>(null);
  const missionFeatureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const valueCardRefs      = useRef<(HTMLDivElement | null)[]>([]);

  // ── Load Lottie (SSR-safe) ────────────────────────────────
  useEffect(() => {
    let instances: Array<{ destroy: () => void }> = [];

    import('lottie-web').then((mod) => {
      const lottie = mod.default as LottiePlayer;

      const loads: Array<{ ref: React.RefObject<HTMLDivElement | null>; path: string }> = [
        {
          ref: artLottieRef,
          path: 'https://assets9.lottiefiles.com/packages/lf20_jcikwtux.json',
        },
        {
          ref: missionLottieRef,
          path: 'https://assets2.lottiefiles.com/packages/lf20_ydo1amjm.json',
        },
        {
          ref: decorLottieRef,
          path: 'https://assets2.lottiefiles.com/packages/lf20_jfe6ciok.json',
        },
        {
          ref: storyLottieRef,
          path: 'https://assets1.lottiefiles.com/packages/lf20_u4yrau84.json',
        },
      ];

      loads.forEach(({ ref, path }) => {
        if (ref.current) {
          instances.push(
            lottie.loadAnimation({
              container: ref.current,
              renderer: 'svg',
              loop: true,
              autoplay: true,
              path,
            })
          );
        }
      });

      VALUES.forEach((v) => {
        const el = document.getElementById(v.id);
        if (el) {
          instances.push(
            lottie.loadAnimation({
              container: el,
              renderer: 'svg',
              loop: true,
              autoplay: true,
              path: v.path,
            })
          );
        }
      });
    });

    return () => instances.forEach((i) => i.destroy());
  }, []);

  // ── Scroll animations ────────────────────────────────────
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, idx) => {
          if (entry.isIntersecting) {
            setTimeout(
              () => entry.target.classList.add(styles.visible),
              idx * 140
            );
          }
        });
      },
      { threshold: 0.12 }
    );

    [...missionFeatureRefs.current, ...valueCardRefs.current]
      .filter(Boolean)
      .forEach((el) => observer.observe(el!));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* ── NAVBAR ─────────────────────────────────────────── */}
      <nav className={styles.nav}>
        <Link href="/" className={styles.navLogo}>BAZAAR</Link>
        <div className={styles.navLinks}>
          <Link href="/about" className={styles.navBtnActive}>About</Link>
          <Link href="/#how" className={styles.navBtnGhost}>How It Works</Link>
          <Link href="/create" className={styles.navBtn}>Create Room</Link>
          <div className={styles.navAvatar} title="Account">👤</div>
        </div>
      </nav>

      {/* ── ABOUT HERO ─────────────────────────────────────── */}
      <section className={styles.aboutHero}>
        <div className={styles.heroGrid} />
        <div className={styles.heroOrb} />

        <div className={styles.heroLeft}>
          <div className={styles.sectionLabel}>Our Story</div>
          <h1 className={styles.aboutTitle}>
            SELLING<br />
            SHOULD FEEL<br />
            <span className={styles.aboutTitleEm}>PERSONAL.</span>
          </h1>
          <p className={styles.aboutBody}>
            Bazaar was built on one simple idea — that buying and selling
            with people you know should be effortless, trusted, and instant.
            No strangers. No algorithms. Just your circle.
          </p>
          <p className={`${styles.aboutBody} ${styles.aboutBody2}`}>
            We replaced public listing chaos with private rooms, real-time
            status, and a code only you control. The marketplace of the
            future is invite-only.
          </p>
        </div>

        <div className={styles.heroRight}>
          <div className={styles.artCard}>
            <div ref={artLottieRef} className={styles.artCardLottie} />
            <div className={styles.artLabel}>
              <div className={styles.artLabelTag}>The Mission</div>
              <div className={styles.artLabelText}>
                TRUSTED<br />COMMERCE
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MISSION (Foodzilla-style split) ────────────────── */}
      <section className={styles.missionSection}>
        {/* Left */}
        <div className={styles.missionLeft}>
          <div className={styles.missionImageWrap}>
            <div ref={missionLottieRef} className={styles.missionLottie} />
          </div>

          <div className={styles.missionTag}>The Mission</div>
          <h2 className={styles.missionTitle}>
            ENDING<br />"STRANGER<br />DANGER"<br />SELLING.
          </h2>
          <p className={styles.missionBody}>
            Bazaar solves a real trust problem — having buyers you don't
            know competing for your items, ghosting you, or creating
            confusion over what's still available. Using real-time rooms
            with invite codes, Bazaar turns chaotic group sales into smooth,
            transparent experiences for everyone involved.
          </p>
        </div>

        {/* Right — numbered features */}
        <div className={styles.missionRight}>
          <div className={styles.missionFeatures}>
            {MISSION_FEATURES.map((f, i) => (
              <div
                key={f.num}
                className={styles.missionFeature}
                ref={(el) => { missionFeatureRefs.current[i] = el; }}
              >
                <div className={styles.mfNum}>{f.num}</div>
                <div>
                  <h3 className={styles.mfTitle}>{f.title}</h3>
                  <p className={styles.mfDesc}>{f.desc}</p>
                </div>
              </div>
            ))}

            {/* Decorative lottie */}
            <div className={styles.missionDecor}>
              <div ref={decorLottieRef} className={styles.missionDecorLottie} />
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ─────────────────────────────────────────── */}
      <section className={styles.valuesSection}>
        <div className={styles.sectionLabel}>What We Stand For</div>
        <h2 className={styles.valuesSectionTitle}>
          BUILT ON{' '}
          <span className={styles.valuesSectionTitleEm}>3</span> BELIEFS.
        </h2>

        <div className={styles.valuesGrid}>
          {VALUES.map((v, i) => (
            <div
              key={v.id}
              className={styles.valueCard}
              ref={(el) => { valueCardRefs.current[i] = el; }}
            >
              <div id={v.id} className={styles.valueIcon} />
              <h3 className={styles.valueTitle}>{v.title}</h3>
              <p className={styles.valueDesc}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── STORY ──────────────────────────────────────────── */}
      <section className={styles.storySection}>
        <div className={styles.storyInner}>
          {/* Left — lottie + stats */}
          <div className={styles.storyLottieWrap}>
            <div ref={storyLottieRef} className={styles.storyLottie} />
            <div className={styles.storyStatRow}>
              <div className={styles.storyStat}>
                <span className={styles.storyStatValue}>6</span>
                <span className={styles.storyStatLabel}>Digit Code</span>
              </div>
              <div className={styles.storyStat}>
                <span className={styles.storyStatValue}>∞</span>
                <span className={styles.storyStatLabel}>Products/Room</span>
              </div>
              <div className={styles.storyStat}>
                <span className={styles.storyStatValue}>0</span>
                <span className={styles.storyStatLabel}>Public Listings</span>
              </div>
            </div>
          </div>

          {/* Right — story text */}
          <div className={styles.storyContent}>
            <div className={styles.sectionLabel}>Origin Story</div>
            <h2 className={styles.storyTitle}>
              IT STARTED<br />WITH A<br />
              <span className={styles.storyTitleEm}>WHATSAPP</span><br />
              GROUP.
            </h2>
            <p className={styles.storyBody}>
              The founder was trying to sell clothes from her old wardrobe
              to friends. She made a WhatsApp group, posted photos, and within
              minutes chaos broke out — ten people asking "Is the jacket taken?",
              screenshots going missing, two people claiming the same shoes.
            </p>
            <blockquote className={styles.storyQuote}>
              "There had to be a better way. Something that felt like a private
              store — but took 30 seconds to set up."
            </blockquote>
            <p className={styles.storyBody}>
              That frustration became Bazaar. A place where your circle buys
              from you on your terms, in real time, with zero confusion. Built
              for wardrobes, handmade goods, event ticket drops, community
              swaps — anything you'd sell to people you trust.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA BAND ───────────────────────────────────────── */}
      <section className={styles.ctaBand}>
        <h2 className={styles.ctaTitle}>
          READY TO<br />
          <span className={styles.ctaTitleAccent}>SELL SMARTER?</span>
        </h2>
        <p className={styles.ctaSub}>
          Create your first private room in 30 seconds. No sign-up required.
        </p>
        <div className={styles.ctaActions}>
          <Link href="/create" className={styles.ctaBtnPrimary}>✦ Create a Room</Link>
          <Link href="/#how" className={styles.ctaBtnGhost}>See How It Works</Link>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <footer className={styles.footer}>
        <span className={styles.footerLogo}>BAZAAR</span>
        <div className={styles.footerLinks}>
          <Link href="/about" className={styles.footerLink}>About</Link>
          <Link href="/#how" className={styles.footerLink}>How It Works</Link>
          <a href="#" className={styles.footerLink}>Privacy</a>
        </div>
        <span className={styles.footerCopy}>© 2025 Bazaar. Built with ✦</span>
      </footer>
    </>
  );
}