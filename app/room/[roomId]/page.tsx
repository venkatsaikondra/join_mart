'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import styles from './page.module.css';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  status: 'available' | 'held' | 'sold';
  heldBy?: string;
}

export default function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [roomName, setRoomName] = useState('Room');
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const isVendor = true; // derive from session/store in real app

  const [form, setForm] = useState({
    name: '', description: '', price: '', currency: '₹',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    // fetch room + products from API
    fetch(`/api/room/${roomId}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => { 
        setRoomName(d.name); 
        setProducts(d.products); 
      })
      .catch(() => {});
  }, [roomId]);

  const copyCode = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    let imageUrl = '';
    if (imageFile) {
      imageUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(imageFile);
      });
    }
    const res = await fetch('/api/product/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId, ...form, price: Number(form.price), imageUrl }),
    });
    const newProduct = await res.json();
    setProducts(prev => [newProduct, ...prev]);
    setShowModal(false);
    setForm({ name: '', description: '', price: '', currency: '₹' });
    setImageFile(null);
  };

  const handleHold = async (productId: string) => {
    await fetch('/api/product/hold', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });
    setProducts(prev =>
      prev.map(p => p.id === productId ? { ...p, status: 'held', heldBy: 'You' } : p)
    );
  };

  const handleSell = async (productId: string) => {
    await fetch('/api/product/sell', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });
    setProducts(prev =>
      prev.map(p => p.id === productId ? { ...p, status: 'sold' } : p)
    );
  };

  const counts = {
    available: products.filter(p => p.status === 'available').length,
    held: products.filter(p => p.status === 'held').length,
    sold: products.filter(p => p.status === 'sold').length,
  };

  return (
    <div className={styles.page}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.navLeft}>
          <h1 className={styles.roomName}>{roomName}</h1>
          <div className={styles.roomMeta}>
            <span className={styles.liveDot} />
            <span className={styles.roomCode}>Room Code</span>
          </div>
        </div>

        <div className={styles.navRight}>
          <button className={styles.codePill} onClick={copyCode} title="Copy code">
            <span className={styles.codeValue}>{roomId}</span>
            <span className={styles.copyIcon}>{copied ? '✓' : '⎘'}</span>
          </button>
          {isVendor && (
            <button className={styles.addBtn} onClick={() => setShowModal(true)}>
              + Add Product
            </button>
          )}
        </div>
      </nav>

      {/* Body */}
      <div className={styles.body}>
        {/* Stats strip */}
        <div className={styles.statsStrip}>
          <div className={styles.statChip}>
            <span className={`${styles.chipDot} ${styles.green}`} />
            <span className={styles.chipText}>{counts.available} Available</span>
          </div>
          <div className={styles.statChip}>
            <span className={`${styles.chipDot} ${styles.yellow}`} />
            <span className={styles.chipText}>{counts.held} Held</span>
          </div>
          <div className={styles.statChip}>
            <span className={`${styles.chipDot} ${styles.red}`} />
            <span className={styles.chipText}>{counts.sold} Sold</span>
          </div>
        </div>

        {/* Products grid */}
        {products.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🛍</div>
            <p className={styles.emptyTitle}>No products yet</p>
            <p className={styles.emptyDesc}>
              {isVendor ? 'Add your first product above.' : 'Waiting for the vendor to add items.'}
            </p>
          </div>
        ) : (
          <div className={styles.grid}>
            {products.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                isVendor={isVendor}
                onHold={() => handleHold(p.id)}
                onSell={() => handleSell(p.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showModal && (
        <div className={styles.overlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Add Product</h2>
              <button className={styles.closeBtn} onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form className={styles.uploadForm} onSubmit={handleAddProduct}>
              <div className={styles.field}>
                <label className={styles.label}>Product Name</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="e.g. Vintage Denim Jacket"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Description</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Condition, size, notes…"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className={styles.priceRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Currency</label>
                  <select
                    className={styles.input}
                    value={form.currency}
                    onChange={e => setForm({ ...form, currency: e.target.value })}
                  >
                    <option value="₹">₹ INR</option>
                    <option value="$">$ USD</option>
                    <option value="€">€ EUR</option>
                    <option value="£">£ GBP</option>
                  </select>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Price</label>
                  <input
                    className={styles.input}
                    type="number"
                    min={0}
                    placeholder="0"
                    required
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Product Image</label>
                <input
                  className={styles.input}
                  type="file"
                  accept="image/*"
                  onChange={e => setImageFile(e.target.files?.[0] || null)}
                />
              </div>

              <button className={styles.submitBtn} type="submit">
                ✦ List Product
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}