"use client";

import React, { useState, useEffect } from 'react';

// Sample animal data
const initialAnimals = [
  {
    id: '1',
    title: 'Sunny Golden Retriever',
    src: '/golden_retriever_sunny_1781698101364.png',
  },
  {
    id: '2',
    title: 'Cute Fluffy Kitten',
    src: '/cute_kitten_bright_1781698113473.png',
  },
  {
    id: '3',
    title: 'Majestic Savanna Lion',
    src: '/majestic_lion_clear_1781698124722.png',
  }
];

export default function Home() {
  const [selectedAnimal, setSelectedAnimal] = useState<any>(null);
  const [feedbacks, setFeedbacks] = useState<Record<string, {name: string, text: string, date: string}[]>>({});
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');

  // Close modal on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedAnimal(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim() || !selectedAnimal) return;

    const newFeedback = {
      name: name.trim(),
      text: comment.trim(),
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };

    setFeedbacks(prev => ({
      ...prev,
      [selectedAnimal.id]: [...(prev[selectedAnimal.id] || []), newFeedback]
    }));

    setName('');
    setComment('');
  };

  return (
    <main className="container">
      <header className="header">
        <h1>Animal Impressions</h1>
        <p>A premium gallery to share your thoughts on nature's finest.</p>
      </header>

      <div className="masonry-grid">
        {initialAnimals.map((animal) => (
          <div 
            key={animal.id} 
            className="card"
            onClick={() => setSelectedAnimal(animal)}
          >
            <img src={animal.src} alt={animal.title} className="card-image" />
            <div className="card-overlay">
              <h3 className="card-title">{animal.title}</h3>
              <p style={{ color: 'var(--primary)', fontWeight: 500, fontSize: '0.9rem' }}>
                {(feedbacks[animal.id] || []).length} Comments
              </p>
            </div>
          </div>
        ))}
      </div>

      {selectedAnimal && (
        <div className="modal-overlay" onClick={() => setSelectedAnimal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedAnimal(null)} aria-label="Close">
              &times;
            </button>
            
            <div style={{ position: 'relative' }}>
              <img 
                src={selectedAnimal.src} 
                alt={selectedAnimal.title} 
                className="modal-image"
              />
            </div>
            
            <div className="modal-body">
              <div className="feedback-section">
                <h2 className="feedback-title">Feedback for {selectedAnimal.title}</h2>
                
                <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="name">Your Name</label>
                    <input 
                      id="name"
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Jane Doe"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="comment">Your Impression</label>
                    <textarea 
                      id="comment"
                      className="form-textarea" 
                      placeholder="What do you think about this picture?"
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn">Post Feedback</button>
                </form>

                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-main)' }}>
                  Community Impressions
                </h3>
                
                <div className="comments-list">
                  {!(feedbacks[selectedAnimal.id] && feedbacks[selectedAnimal.id].length > 0) ? (
                    <div className="no-comments">Be the first to share your impression!</div>
                  ) : (
                    feedbacks[selectedAnimal.id].map((fb, idx) => (
                      <div key={idx} className="comment">
                        <div className="comment-time">{fb.date}</div>
                        <div className="comment-author">{fb.name}</div>
                        <div className="comment-text">{fb.text}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
