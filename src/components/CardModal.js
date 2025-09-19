import React, { useState, useEffect } from 'react';

export default function CardModal({ card, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (card) {
      setTitle(card.title);
      setDescription(card.description || '');
    } else {
      setTitle('');
      setDescription('');
    }
  }, [card]);

  function handleSave() {
    if (!title.trim()) {
      alert('Card title is required');
      return;
    }

    onSave({ title: title.trim(), description: description.trim() });
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{card ? 'Edit Card' : 'Add New Card'}</h3>
        
        <label>Title *</label>
        <input 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          placeholder="Card title"
        />
        
        <label>Description</label>
        <textarea 
          value={description} 
          onChange={e => setDescription(e.target.value)} 
          placeholder="Card description (optional)"
          rows="3"
        />
        
        <div className="modal-actions">
          <button onClick={handleSave}>
            {card ? 'Save Changes' : 'Add Card'}
          </button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
