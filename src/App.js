import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import BoardView from './components/BoardView';

function generateId(prefix = '') {
  return `${prefix}${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function createDefaultBoard(name) {
  return {
    id: generateId('board-'),
    name: name || 'New Board',
    lists: [
      { id: generateId('list-'), name: 'To Do', cards: [] },
      { id: generateId('list-'), name: 'In Progress', cards: [] },
      { id: generateId('list-'), name: 'Done', cards: [] }
    ]
  };
}

function loadBoards() {
  try {
    const saved = localStorage.getItem('trello_boards');
    return saved ? JSON.parse(saved) : [createDefaultBoard('My First Board')];
  } catch {
    return [createDefaultBoard('My First Board')];
  }
}

function saveBoards(boards) {
  try {
    localStorage.setItem('trello_boards', JSON.stringify(boards));
  } catch {}
}

export default function App() {
  const [boards, setBoards] = useState(loadBoards());
  const [activeBoardId, setActiveBoardId] = useState(null);

  useEffect(() => {
    saveBoards(boards);
  }, [boards]);

  function addBoard(name) {
    const newBoard = createDefaultBoard(name);
    setBoards([newBoard, ...boards]);
    setActiveBoardId(newBoard.id);
  }

  function deleteBoard(boardId) {
    if (!window.confirm('Delete this board?')) return;
    setBoards(boards.filter(b => b.id !== boardId));
    if (activeBoardId === boardId) setActiveBoardId(null);
  }

  function updateBoard(updatedBoard) {
    setBoards(boards.map(b => (b.id === updatedBoard.id ? updatedBoard : b)));
  }

  const activeBoard = boards.find(b => b.id === activeBoardId);

  return (
    <div className="app-root">
      <header className="app-header">
        <h1>Trello-like Task Manager</h1>
        {activeBoard && (
          <div className="header-actions">
            <button onClick={() => setActiveBoardId(null)}>Dashboard</button>
          </div>
        )}
      </header>

      <main className="app-main">
        {activeBoard ? (
          <BoardView
            board={activeBoard}
            onBack={() => setActiveBoardId(null)}
            onUpdate={updateBoard}
            onDeleteBoard={() => deleteBoard(activeBoard.id)}
          />
        ) : (
          <Dashboard
            boards={boards}
            onAddBoard={addBoard}
            onOpenBoard={setActiveBoardId}
            onDeleteBoard={deleteBoard}
          />
        )}
      </main>

      <footer className="app-footer">
        <small>Data saved in browser storage</small>
      </footer>
    </div>
  );
}
