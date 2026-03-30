import styles from './ProductCard.module.css';

interface Product {
  id: string;
  name: string;
  description: string;
  price?: number;
  imageUrl: string;
  status: 'available' | 'held' | 'sold';
  heldBy?: string;
}

interface Props {
  product: Product;
  isVendor: boolean;
  onHold: () => void;
  onSell: () => void;
}

const STATUS_LABELS = {
  available: 'Available',
  held: 'Held',
  sold: 'Sold',
};

export default function ProductCard({ product, isVendor, onHold, onSell }: Props) {
  const { name, description, price, imageUrl, status, heldBy } = product;

  return (
    <article className={`${styles.card} ${styles[status]}`}>
      <header className={styles.cardHeader}>
        <div className={styles.userBadge}>
          <span className={styles.avatar}>V</span>
          <div>
            <p className={styles.vendorName}>Vendor</p>
            <p className={styles.vendorMeta}>Shared in this room</p>
          </div>
        </div>
        <span className={styles.options}>⋯</span>
      </header>

      <div className={styles.imageWrap}>
        {imageUrl ? (
          <img src={imageUrl} alt={name} className={styles.image} />
        ) : (
          <div className={styles.imageFallback}>🛍</div>
        )}
        {status === 'sold' && (
          <div className={styles.soldOverlay}>
            <span className={styles.soldStamp}>SOLD</span>
          </div>
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.caption}>
          <h3 className={styles.name}>{name}</h3>
          {description && <p className={styles.description}>{description}</p>}
        </div>

        <div className={styles.metaRow}>
          <span className={styles.price}>₹{price ? price.toLocaleString('en-IN') : 'N/A'}</span>
          <span className={`${styles.statusTag} ${styles[status]}`}>
            {STATUS_LABELS[status]}
          </span>
        </div>

        <div className={styles.footer}>
          <div className={styles.holdInfo}>
            {status === 'held' && heldBy ? `Held by ${heldBy}` : 'Tap for details'}
          </div>

          <div className={styles.actions}>
            {!isVendor && (
              <button
                className={styles.btnHold}
                onClick={onHold}
                disabled={status !== 'available'}
                title={status !== 'available' ? 'Item not available' : 'Hold this item'}
              >
                🤚 Hold
              </button>
            )}
            {isVendor && (
              <button
                className={styles.btnSell}
                onClick={onSell}
                disabled={status === 'sold'}
                title={status === 'sold' ? 'Already sold' : 'Mark as sold'}
              >
                ✓ Sold
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
