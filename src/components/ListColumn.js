import React from 'react';
import CardItem from './CardItem';

export default function ListColumn({ 
  list, 
  onAddCard, 
  onEditCard, 
  onDeleteCard, 
  onRenameList, 
  onDeleteList,
  onDragStart,
  onDragOver,
  onDrop
}) {
  return (
    <div className="list-column" onDragOver={onDragOver} onDrop={onDrop}>
      <div className="list-header">
        <h4>{list.name}</h4>
        <div className="list-actions">
          <button onClick={() => {
            const newName = prompt('Rename list', list.name);
            if (newName) onRenameList(newName);
          }}>Rename</button>
          <button onClick={() => {
            if (window.confirm('Delete this list?')) onDeleteList();
          }}>Delete</button>
        </div>
      </div>

      <div className="cards-area">
        {list.cards.length === 0 ? (
          <div className="empty">No cards yet</div>
        ) : (
          list.cards.map(card => (
            <div key={card.id} draggable onDragStart={() => onDragStart(card)}>
              <CardItem
                card={card}
                onEdit={() => onEditCard(card)}
                onDelete={() => onDeleteCard(card.id)}
              />
            </div>
          ))
        )}
      </div>

      <div className="list-footer">
        <button onClick={onAddCard}>+ Add Card</button>
      </div>
    </div>
  );
}
