const ROWS = 6;
const COLS = 7;
let board = [];
let currentPlayer = 1;
let gameOver = false;

const boardElement = document.getElementById('game-board');
const statusElement = document.getElementById('status');
const restartButton = document.getElementById('restart-button');

function createBoard() {
    board = Array(ROWS).fill(null).map(() => Array(COLS).fill(0));
    boardElement.innerHTML = '';
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            // We handle clicks on the board and determine the column
            boardElement.appendChild(cell);
        }
    }
    boardElement.addEventListener('click', handleBoardClick);
}

function handleBoardClick(e) {
    if (gameOver) return;
    
    const target = e.target.closest('.cell');
    if (!target) return;

    const col = parseInt(target.dataset.col);

    for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row][col] === 0) {
            board[row][col] = currentPlayer;
            const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
            
            const piece = document.createElement('div');
            piece.classList.add('piece', `player${currentPlayer}`);
            cell.appendChild(piece);

            // Trigger the drop animation
            setTimeout(() => {
                piece.classList.add('drop');
            }, 10);
            
            // Check for win/draw after animation
            setTimeout(() => {
                if (checkWin(row, col)) {
                    statusElement.textContent = `Player ${currentPlayer} Wins!`;
                    gameOver = true;
                    return;
                }

                if (checkDraw()) {
                    statusElement.textContent = "It's a Draw!";
                    gameOver = true;
                    return;
                }

                currentPlayer = currentPlayer === 1 ? 2 : 1;
                statusElement.textContent = `Player ${currentPlayer}'s Turn (${currentPlayer === 1 ? 'Red' : 'Yellow'})`;
            }, 400); // Should be slightly longer than the animation time
            return;
        }
    }
}

function checkWin(row, col) {
    const player = board[row][col];

    // Check horizontal
    for (let c = 0; c <= COLS - 4; c++) {
        if (board[row][c] === player && board[row][c + 1] === player && board[row][c + 2] === player && board[row][c + 3] === player) return true;
    }
    // Check vertical
    for (let r = 0; r <= ROWS - 4; r++) {
        if (board[r][col] === player && board[r + 1][col] === player && board[r + 2][col] === player && board[r + 3][col] === player) return true;
    }
    // Check diagonal (down-right)
    for (let r = 0; r <= ROWS - 4; r++) {
        for (let c = 0; c <= COLS - 4; c++) {
            if (board[r][c] === player && board[r + 1][c + 1] === player && board[r + 2][c + 2] === player && board[r + 3][c + 3] === player) return true;
        }
    }
    // Check diagonal (up-right)
    for (let r = 3; r < ROWS; r++) {
        for (let c = 0; c <= COLS - 4; c++) {
            if (board[r][c] === player && board[r - 1][c + 1] === player && board[r - 2][c + 2] === player && board[r - 3][c + 3] === player) return true;
        }
    }
    return false;
}

function checkDraw() {
    return board.every(row => row.every(cell => cell !== 0));
}

function restartGame() {
    createBoard();
    currentPlayer = 1;
    gameOver = false;
    statusElement.textContent = `Player 1's Turn (Red)`;
}

restartButton.addEventListener('click', restartGame);
createBoard();
