import Link from 'next/link';
import styles from './RoomCard.module.css';

interface RoomCardProps {
  id: string;
  code: string;
  name: string;
  description?: string;
  productCount?: { available: number; held: number; sold: number };
  createdAt: string;
}

export default function RoomCard({
  code, name, description, productCount, createdAt,
}: RoomCardProps) {
  const total = (productCount?.available ?? 0) + (productCount?.held ?? 0) + (productCount?.sold ?? 0);
  const formatted = new Date(createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

  return (
    <Link href={`/room/${code}`} className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.name}>{name}</h3>
        <span className={styles.code}>{code}</span>
      </div>

      {description && <p className={styles.description}>{description}</p>}

      <div className={styles.footer}>
        <div className={styles.stats}>
          <span className={styles.stat}>
            <span className={`${styles.dot} ${styles.green}`} />
            {productCount?.available ?? 0}
          </span>
          <span className={styles.stat}>
            <span className={`${styles.dot} ${styles.yellow}`} />
            {productCount?.held ?? 0}
          </span>
          <span className={styles.stat}>
            <span className={`${styles.dot} ${styles.red}`} />
            {productCount?.sold ?? 0}
          </span>
        </div>
        <span className={styles.created}>{formatted}</span>
      </div>

      <span className={styles.arrow}>→</span>
    </Link>
  );
}