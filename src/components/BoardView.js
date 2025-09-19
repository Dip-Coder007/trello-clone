import React, { useState } from 'react';
import ListColumn from './ListColumn';
import CardModal from './CardModal';

function generateId(prefix = '') {
  return `${prefix}${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function BoardView({ board, onBack, onUpdate, onDeleteBoard }) {
  const [showModal, setShowModal] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [currentListId, setCurrentListId] = useState(null);
  const [draggedCard, setDraggedCard] = useState(null);

  function addList(name) {
    if (!name.trim()) return;
    const newList = { id: generateId('list-'), name: name.trim(), cards: [] };
    onUpdate({ ...board, lists: [...board.lists, newList] });
  }

  function renameList(listId, newName) {
    if (!newName.trim()) return;
    onUpdate({
      ...board,
      lists: board.lists.map(list =>
        list.id === listId ? { ...list, name: newName.trim() } : list
      ),
    });
  }

  function deleteList(listId) {
    if (!window.confirm('Delete this list and all its cards?')) return;
    onUpdate({ ...board, lists: board.lists.filter(list => list.id !== listId) });
  }

  function addCard(listId, title, description) {
    if (!title.trim()) return;
    const newCard = { id: generateId('card-'), title: title.trim(), description: description?.trim() || '' };
    onUpdate({
      ...board,
      lists: board.lists.map(list =>
        list.id === listId ? { ...list, cards: [...list.cards, newCard] } : list
      ),
    });
  }

  function updateCard(listId, cardId, updates) {
    onUpdate({
      ...board,
      lists: board.lists.map(list =>
        list.id === listId
          ? { ...list, cards: list.cards.map(card => (card.id === cardId ? { ...card, ...updates } : card)) }
          : list
      ),
    });
  }

  function deleteCard(listId, cardId) {
    if (!window.confirm('Delete this card?')) return;
    onUpdate({
      ...board,
      lists: board.lists.map(list =>
        list.id === listId
          ? { ...list, cards: list.cards.filter(card => card.id !== cardId) }
          : list
      ),
    });
  }

  function handleDragStart(listId, card) {
    setDraggedCard({ ...card, sourceListId: listId });
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleDrop(targetListId) {
    if (!draggedCard) return;
    const { sourceListId, id, title, description } = draggedCard;
    const updatedLists = board.lists.map(list => {
      if (list.id === sourceListId) {
        list.cards = list.cards.filter(card => card.id !== id);
      }
      if (list.id === targetListId) {
        list.cards = [...list.cards, { id, title, description }];
      }
      return list;
    });
    onUpdate({ ...board, lists: updatedLists });
    setDraggedCard(null);
  }

  function openAddCardModal(listId) {
    setCurrentListId(listId);
    setEditingCard(null);
    setShowModal(true);
  }

  function openEditCardModal(listId, card) {
    setCurrentListId(listId);
    setEditingCard(card);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingCard(null);
    setCurrentListId(null);
  }

  function handleSaveCard(cardData) {
    if (editingCard) {
      updateCard(currentListId, editingCard.id, cardData);
    } else {
      addCard(currentListId, cardData.title, cardData.description);
    }
    closeModal();
  }

  return (
    <div className="board-view">
      <div className="board-top">
        <button onClick={onBack}>← Back</button>
        <h2>{board.name}</h2>
        <div className="board-top-actions">
          <button onClick={() => {
            const newName = prompt('Rename board', board.name);
            if (newName) onUpdate({ ...board, name: newName });
          }}>Rename</button>
          <button onClick={() => {
            if (window.confirm('Delete this board?')) onDeleteBoard();
          }}>Delete</button>
        </div>
      </div>

      <div className="board-body">
        {board.lists.map(list => (
          <ListColumn
            key={list.id}
            list={list}
            onAddCard={() => openAddCardModal(list.id)}
            onEditCard={card => openEditCardModal(list.id, card)}
            onDeleteCard={cardId => deleteCard(list.id, cardId)}
            onRenameList={newName => renameList(list.id, newName)}
            onDeleteList={() => deleteList(list.id)}
            onDragStart={card => handleDragStart(list.id, card)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(list.id)}
          />
        ))}
        
        <div className="list-wrapper add-list">
          <button onClick={() => {
            const name = prompt('New list name', 'New List');
            if (name) addList(name);
          }}>+ Add List</button>
        </div>
      </div>

      {showModal && (
        <CardModal
          card={editingCard}
          onClose={closeModal}
          onSave={handleSaveCard}
        />
      )}
    </div>
  );
}
