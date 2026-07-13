"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { initialAnimals } from '../page';

export default function GlobalFeed() {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/feedback')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setFeedbacks(data.reverse()); // Show newest first
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getAnimalTitle = (id: string) => {
    const animal = initialAnimals.find(a => a.id === id);
    return animal ? animal.title : 'Unknown Animal';
  };

  return (
    <main className="container">
      <header className="header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <div>
          <h1>Global Impressions</h1>
          <p>See what everyone is saying across all pictures.</p>
        </div>
        <Link href="/" className="btn" style={{ textDecoration: 'none', display: 'inline-block' }}>
          &larr; Back to Gallery
        </Link>
      </header>

      <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%', paddingBottom: '3rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-main)' }}>Loading impressions...</div>
        ) : feedbacks.length === 0 ? (
          <div className="no-comments" style={{ textAlign: 'center' }}>No impressions have been shared yet.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {feedbacks.map((fb, idx) => (
              <div key={idx} className="comment" style={{ background: '#ffffff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div className="comment-author" style={{ fontSize: '1.15rem', margin: 0 }}>{fb.name}</div>
                  <div className="comment-time" style={{ fontSize: '0.85rem', color: '#888' }}>{fb.date}</div>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Re: {getAnimalTitle(fb.animalId)}
                </div>
                <div className="comment-text" style={{ fontSize: '1.05rem', lineHeight: 1.5, color: '#444' }}>"{fb.text}"</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
