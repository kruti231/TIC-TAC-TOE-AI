let board;
const player = 'X';
const ai = 'O';
const messageDisplay = document.getElementById('message');
const cells = document.querySelectorAll('.cell');

function initializeGame() {
    board = Array(9).fill(null);
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('disabled');
        cell.addEventListener('click', handlePlayerMove, { once: true });
    });
    messageDisplay.textContent = "Your Turn!";
}

function handlePlayerMove(event) {
    const index = event.target.id;
    board[index] = player;
    event.target.textContent = player;
    if (checkWinner(board, player)) {
        messageDisplay.textContent = "You win!";
        endGame();
    } else if (board.every(cell => cell)) {
        messageDisplay.textContent = "It's a draw!";
    } else {
        messageDisplay.textContent = "AI's Turn!";
        setTimeout(makeAIMove, 500);
    }
}

function makeAIMove() {
    const bestMove = minimax(board, ai).index;
    board[bestMove] = ai;
    cells[bestMove].textContent = ai;

    if (checkWinner(board, ai)) {
        messageDisplay.textContent = "AI wins!";
        endGame();
    } else if (board.every(cell => cell)) {
        messageDisplay.textContent = "It's a draw!";
    } else {
        messageDisplay.textContent = "Your Turn!";
    }
}

function checkWinner(board, player) {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    return winningCombinations.some(combination => {
        return combination.every(index => {
            return board[index] === player;
        });
    });
}

function minimax(newBoard, player) {
    const availableSpots = newBoard.map((value, index) => value === null ? index : null).filter(value => value !== null);

    if (checkWinner(newBoard, ai)) {
        return { score: 10 };
    } else if (checkWinner(newBoard, player)) {
        return { score: -10 };
    } else if (availableSpots.length === 0) {
        return { score: 0 };
    }

    const moves = [];

    for (let spot of availableSpots) {
        const move = {};
        move.index = spot;
        newBoard[spot] = player;

        if (player === ai) {
            const result = minimax(newBoard, player === ai ? player : player);
            move.score = result.score;
        } else {
            const result = minimax(newBoard, ai);
            move.score = result.score;
        }

        newBoard[spot] = null;
        moves.push(move);
    }

    let bestMove;
    if (player === ai) {
        let bestScore = -Infinity;
        for (let move of moves) {
            if (move.score > bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let move of moves) {
            if (move.score < bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        }
    }
    return bestMove;
}

function endGame() {
    cells.forEach(cell => {
        cell.classList.add('disabled');
    });
}

document.getElementById('restartBtn').addEventListener('click', initializeGame);
initializeGame();