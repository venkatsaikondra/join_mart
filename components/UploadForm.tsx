'use client';

import { useState, useRef } from 'react';
import styles from './UploadForm.module.css';

interface Props {
  roomId: string;
  onSuccess: (product: unknown) => void;
}

export default function UploadForm({ roomId, onSuccess }: Props) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    currency: '₹',
    imageUrl: '',
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreview(result);
      setForm(f => ({ ...f, imageUrl: result })); // base64 for demo; swap with Cloudinary URL in prod
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) { setError('Name and price are required.'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/product/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          name: form.name,
          description: form.description,
          price: Number(form.price),
          imageUrl: form.imageUrl,
        }),
      });
      if (!res.ok) throw new Error('Failed to add product');
      const product = await res.json();
      onSuccess(product);
      setForm({ name: '', description: '', price: '', currency: '₹', imageUrl: '' });
      setPreview(null);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* Image drop zone */}
      <div className={styles.field}>
        <label className={styles.label}>Product Image</label>
        {preview ? (
          <img src={preview} alt="Preview" className={styles.preview} />
        ) : (
          <div
            className={`${styles.dropZone} ${dragging ? styles.dragging : ''}`}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => {
              e.preventDefault();
              setDragging(false);
              const file = e.dataTransfer.files[0];
              if (file?.type.startsWith('image/')) handleFile(file);
            }}
            onClick={() => fileRef.current?.click()}
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />
            <div className={styles.dropIcon}>🖼</div>
            <p className={styles.dropText}>
              Drop an image or <span>browse</span><br />
              PNG, JPG up to 5 MB
            </p>
          </div>
        )}
      </div>

      {/* Name */}
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

      {/* Description */}
      <div className={styles.field}>
        <label className={styles.label}>Description</label>
        <textarea
          className={`${styles.input} ${styles.textarea}`}
          placeholder="Condition, size, notes…"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />
      </div>

      {/* Price row */}
      <div className={styles.row}>
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

      {error && <div className={styles.error}>{error}</div>}

      <button className={styles.submit} type="submit" disabled={loading}>
        {loading ? <span className={styles.spinner} /> : '✦ List Product'}
      </button>
    </form>
  );
}