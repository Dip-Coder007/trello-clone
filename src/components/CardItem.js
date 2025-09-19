import React from 'react';

export default function CardItem({ card, onEdit, onDelete }) {
  return (
    <div className="card-item">
      <div className="card-title">{card.title}</div>
      {card.description && <div className="card-desc">{card.description}</div>}
      <div className="card-controls">
        <button onClick={onEdit}>Edit</button>
        <button onClick={() => { if (window.confirm('Delete card?')) onDelete(); }}>Delete</button>
      </div>
    </div>
  );
}
