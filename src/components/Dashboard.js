import React, { useState } from 'react';

export default function Dashboard({ boards, onAddBoard, onOpenBoard, onDeleteBoard }) {
  const [name, setName] = useState('');

  function handleCreate(e) {
    e.preventDefault();
    if (!name.trim()) {
      alert('Board name required.');
      return;
    }
    onAddBoard(name.trim());
    setName('');
  }

  return (
    <div className="dashboard">
      <div className="dashboard-create">
        <form onSubmit={handleCreate}>
          <input 
            value={name} 
            onChange={e => setName(e.target.value)} 
            placeholder="New board name" 
          />
          <button type="submit">Create Board</button>
        </form>
      </div>

      <div className="boards-grid">
        {boards.map(board => (
          <div className="board-card" key={board.id}>
            <h3>{board.name}</h3>
            <p>{board.lists.length} lists</p>
            <div className="board-actions">
              <button onClick={() => onOpenBoard(board.id)}>Open</button>
              <button onClick={() => {
                if (window.confirm('Delete this board?')) onDeleteBoard(board.id);
              }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
