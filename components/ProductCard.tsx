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
  available: '🟢 Available',
  held: '🟡 Held',
  sold: '🔴 Sold',
};

export default function ProductCard({ product, isVendor, onHold, onSell }: Props) {
  const { name, description, price, imageUrl, status, heldBy } = product;

  return (
    <div className={`${styles.card} ${styles[status]}`}>
      {/* Image */}
      <div className={styles.imageWrap}>
        {imageUrl ? (
          <img src={imageUrl} alt={name} className={styles.image} />
        ) : (
          <div className={styles.imageFallback}>🛍</div>
        )}

        {/* Status badge */}
        <div className={`${styles.badge} ${styles[status]}`}>
          <span className={styles.badgeDot} />
          {status === 'available' ? 'Available' : status === 'held' ? 'Held' : 'Sold'}
        </div>

        {/* Sold overlay stamp */}
        {status === 'sold' && (
          <div className={styles.soldOverlay}>
            <span className={styles.soldStamp}>SOLD</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className={styles.body}>
        <h3 className={styles.name}>{name}</h3>
        {description && <p className={styles.description}>{description}</p>}

        <div className={styles.footer}>
          <div>
            <span className={styles.price}>₹{price ? price.toLocaleString('en-IN') : 'N/A'}</span>
            {status === 'held' && heldBy && (
              <p className={styles.heldBy}>Held by {heldBy}</p>
            )}
          </div>

          <div className={styles.actions}>
            {/* Buyer: Hold button */}
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

            {/* Vendor: Mark Sold button */}
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
    </div>
  );
}