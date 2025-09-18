const BOARD_SIZE = 6;
const TILE_SIZE = 80;
const CAT_TYPES = 9;
const MATCH_MIN = 3;

const catImages = [
  'images/cat1.jpg',
  'images/cat2.jpg',
  'images/cat3.jpg',
  'images/cat4.jpg',
  'images/cat5.jpg',
  'images/cat6.jpg',
  'images/cat7.jpg',
  'images/cat8.jpg',
  'images/cat9.jpg',
];

let board = [];
let selectedTile = null;
let score = 0;
let highScore = 0;
let timer = 90; // 1.5 minutes in seconds
let timerInterval = null;
let gameActive = true;

const gameBoard = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');

// Initialize the game
function initGame() {
  createBoard();
  renderBoard();
  checkInitialMatches();
  startTimer();
}

// Start the countdown timer
function startTimer() {
  timer = 90;
  gameActive = true;
  updateTimerDisplay();
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (timer <= 0) {
      clearInterval(timerInterval);
      gameActive = false;
      alert('Time is up! Game over.');
      scoreDisplay.classList.add('celebrate');
      setTimeout(() => {
        scoreDisplay.classList.remove('celebrate');
      }, 3000);
      document.querySelector('.completion').classList.add('show');
      setTimeout(() => {
        document.querySelector('.completion').classList.remove('show');
      }, 3000);
      return;
    }
    timer--;
    updateTimerDisplay();
  }, 1000);
}

// Update the timer display
function updateTimerDisplay() {
  const timerElement = document.getElementById('timer');
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  timerElement.textContent = `Time: ${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Override handleTileClick to prevent interaction when game is inactive
const originalHandleTileClick = handleTileClick;
function handleTileClick(event) {
  if (!gameActive) return;
  originalHandleTileClick(event);
}

// Restart button handler
document.getElementById('restart').addEventListener('click', () => {
  score = 0;
  scoreDisplay.textContent = score;
  scoreDisplay.classList.remove('celebrate');
  document.querySelector('.completion').classList.remove('show');
  initGame();
});

// Create the board array
function createBoard() {
  board = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    board[row] = [];
    for (let col = 0; col < BOARD_SIZE; col++) {
      board[row][col] = Math.floor(Math.random() * CAT_TYPES);
    }
  }
}

// Render the board to DOM
function renderBoard() {
  gameBoard.innerHTML = '';
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const tile = document.createElement('div');
      tile.className = 'tile';
      tile.style.backgroundImage = `url(${catImages[board[row][col]]})`;
      tile.dataset.row = row;
      tile.dataset.col = col;
      tile.addEventListener('click', handleTileClick);
      gameBoard.appendChild(tile);
    }
  }
}

// Handle tile click
function handleTileClick(event) {
  if (!gameActive) return;
  const tile = event.target;
  const row = parseInt(tile.dataset.row);
  const col = parseInt(tile.dataset.col);

  if (selectedTile) {
    if (selectedTile.row === row && selectedTile.col === col) {
      // Deselect
      selectedTile.element.classList.remove('selected');
      selectedTile = null;
    } else if (isAdjacent(selectedTile.row, selectedTile.col, row, col)) {
      // Swap
      swapTiles(selectedTile.row, selectedTile.col, row, col);
      selectedTile.element.classList.remove('selected');
      selectedTile = null;
      processMatches();
    } else {
      // Select new
      selectedTile.element.classList.remove('selected');
      tile.classList.add('selected');
      selectedTile = { row, col, element: tile };
    }
  } else {
    // Select
    tile.classList.add('selected');
    selectedTile = { row, col, element: tile };
  }
}

// Check if two positions are adjacent
function isAdjacent(row1, col1, row2, col2) {
  return (Math.abs(row1 - row2) === 1 && col1 === col2) || (Math.abs(col1 - col2) === 1 && row1 === row2);
}

// Swap two tiles
function swapTiles(row1, col1, row2, col2) {
  const temp = board[row1][col1];
  board[row1][col1] = board[row2][col2];
  board[row2][col2] = temp;
}

// Process matches after swap
async function processMatches() {
  let matches = findMatches();
  while (matches.length > 0) {
    await removeMatches(matches);
    dropTiles();
    refillBoard();
    matches = findMatches();
  }
  renderBoard();
}

// Find all matches
function findMatches() {
  const matches = [];

  // Horizontal matches
  for (let row = 0; row < BOARD_SIZE; row++) {
    let count = 1;
    for (let col = 1; col < BOARD_SIZE; col++) {
      if (board[row][col] === board[row][col - 1]) {
        count++;
      } else {
        if (count >= MATCH_MIN) {
          const group = [];
          for (let i = col - count; i < col; i++) {
            group.push({ row, col: i });
          }
          matches.push(group);
        }
        count = 1;
      }
    }
    if (count >= MATCH_MIN) {
      const group = [];
      for (let i = BOARD_SIZE - count; i < BOARD_SIZE; i++) {
        group.push({ row, col: i });
      }
      matches.push(group);
    }
  }

  // Vertical matches
  for (let col = 0; col < BOARD_SIZE; col++) {
    let count = 1;
    for (let row = 1; row < BOARD_SIZE; row++) {
      if (board[row][col] === board[row - 1][col]) {
        count++;
      } else {
        if (count >= MATCH_MIN) {
          const group = [];
          for (let i = row - count; i < row; i++) {
            group.push({ row: i, col });
          }
          matches.push(group);
        }
        count = 1;
      }
    }
    if (count >= MATCH_MIN) {
      const group = [];
      for (let i = BOARD_SIZE - count; i < BOARD_SIZE; i++) {
        group.push({ row: i, col });
      }
      matches.push(group);
    }
  }

  return matches;
}

// Remove matched tiles
function removeMatches(matches) {
  return new Promise(resolve => {
    matches.forEach(group => {
      group.forEach(match => {
        const tile = document.querySelector(`[data-row="${match.row}"][data-col="${match.col}"]`);
        tile.classList.add('star');
        tile.textContent = '⭐';
      });
    });
    setTimeout(() => {
      matches.forEach(group => {
        group.forEach(match => {
          board[match.row][match.col] = -1; // Mark for removal
          const tile = document.querySelector(`[data-row="${match.row}"][data-col="${match.col}"]`);
          tile.classList.remove('star');
          tile.textContent = '';
        });
      });
      score += matches.length * 10; // 10 points per match group
      scoreDisplay.classList.add('celebrate');
      setTimeout(() => {
        scoreDisplay.classList.remove('celebrate');
      }, 1000);
      scoreDisplay.textContent = score;
      resolve();
    }, 2000);
  });
}

// Drop tiles down
function dropTiles() {
  for (let col = 0; col < BOARD_SIZE; col++) {
    let writeIndex = BOARD_SIZE - 1;
    for (let row = BOARD_SIZE - 1; row >= 0; row--) {
      if (board[row][col] !== -1) {
        board[writeIndex][col] = board[row][col];
        if (writeIndex !== row) {
          board[row][col] = -1;
        }
        writeIndex--;
      }
    }
  }
}

// Refill the board
function refillBoard() {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] === -1) {
        board[row][col] = Math.floor(Math.random() * CAT_TYPES);
      }
    }
  }
}

// Check for initial matches and reshuffle if needed
function checkInitialMatches() {
  const matches = findMatches();
  if (matches.length > 0) {
    // Simple reshuffle
    createBoard();
    renderBoard();
    checkInitialMatches();
  }
}

// Start the game
initGame();
