const KEY = 'trello_boards_v1';

export function loadBoards() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse localStorage boards', e);
    return null;
  }
}

export function saveBoards(boards) {
  try {
    localStorage.setItem(KEY, JSON.stringify(boards));
  } catch (e) {
    console.error('Failed to save boards', e);
  }
}
