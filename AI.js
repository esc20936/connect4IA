const ROWS = 6;
const COLS = 7;

function getBestMove(board, depth, playerId) {

    let bestMove = -1;
    let bestValue = -Infinity;
    let validMoves = getValidMoves(board);
    let alpha = -Infinity;
    let beta = Infinity;
    for (let move of validMoves) {
        let newBoard = makeMove(board, move, playerId);
        let value = minimax(newBoard, depth - 1, false, playerId, alpha, beta);
        if (value > bestValue) {
            bestValue = value;
            bestMove = move;
        }
    }
    return bestMove;
}

function minimax(board, depth, isMaximizingPlayer, playerId, alpha, beta) {
    // Base case: check if game is over or depth is reached
    if (depth === 0) {
        return evaluateBoard(board, playerId);
    }

    // Recursive case
    let bestValue;
    let validMoves = getValidMoves(board);
    if (isMaximizingPlayer) {
        bestValue = -Infinity;
        for (let move of validMoves) {
            let newBoard = makeMove(board, move, playerId);
            let value = minimax(newBoard, depth - 1, false, playerId, alpha, beta);
            bestValue = Math.max(bestValue, value);
            alpha = Math.max(alpha, bestValue);
            if (beta <= alpha) {
                break;
            }
        }
    } else {
        bestValue = Infinity;
        let opponentId = playerId === 1 ? 2 : 1;
        for (let move of validMoves) {
            let newBoard = makeMove(board, move, opponentId);
            let value = minimax(newBoard, depth - 1, true, playerId, alpha, beta);
            bestValue = Math.min(bestValue, value);
            beta = Math.min(beta, bestValue);
            if (beta <= alpha) {
                break;
            }
        }
    }
    return bestValue;
}

function evaluateWindow(window, playerId, opponentId) {
    let score = 0;
    if (window.filter(id => id === playerId).length === 4) {
        score += 100;
    } else if (window.filter(id => id === playerId).length === 3 && window.filter(id => id === 0).length === 1) {
        score += 5;
    } else if (window.filter(id => id === playerId).length === 2 && window.filter(id => id === 0).length === 2) {
        score += 2;
    }
    if (window.filter(id => id === opponentId).length === 3 && window.filter(id => id === 0).length === 1) {
        score -= 4;
    }
    return score;
}

function evaluateBoard(board, playerId) {
    let opponentId = playerId === 1 ? 2 : 1;
    let score = 0;
    // Check rows
    for (let i = 0; i < board.length; i++) {
        let row = board[i];
        for (let j = 0; j < row.length - 3; j++) {
            let window = row.slice(j, j + 4);
            score += evaluateWindow(window, playerId, opponentId);
        }
    }
    // Check columns
    for (let i = 0; i < board[0].length; i++) {
        let col = [];
        for (let j = 0; j < board.length; j++) {
            col.push(board[j][i]);
        }
        for (let j = 0; j < col.length - 3; j++) {
            let window = col.slice(j, j + 4);
            score += evaluateWindow(window, playerId, opponentId);
        }
    }
    // Check diagonals
    for (let i = 0; i < board.length - 3; i++) {
        for (let j = 0; j < board[0].length - 3; j++) {
            // Diagonal down-right
            let window = [board[i][j], board[i + 1][j + 1], board[i + 2][j + 2], board[i + 3][j + 3]];
            score += evaluateWindow(window, playerId, opponentId);
            // Diagonal up-right
            window = [board[i + 3][j], board[i + 2][j + 1], board[i + 1][j + 2], board[i][j + 3]];
            score += evaluateWindow(window, playerId, opponentId);
        }
    }
    return score;


}

function getValidMoves(board) {
    // Return an array of valid moves (columns where a coin can be dropped)
    
    let validMoves = [];
    for (let i = 0; i < board[0].length; i++) {
        if (board[0][i] === 0) {
            validMoves.push(i);
        }
    }
    return validMoves;

}

function makeMove(board, move, playerId) {
    // Return a new board with the given move made by the given player
    
    let newBoard = board.map(arr => arr.slice());
    for (let i = newBoard.length - 1; i >= 0; i--) {
        if (newBoard[i][move] === 0) {
            newBoard[i][move] = playerId;
            break;
        }
    }
    return newBoard;
}



// // function to generate a random board
// function generateBoard() {
//     // generate possible boards of connect 4
//     // none of the boards have a winner

//     let boards= [];

//     let board1 = [
//         0, 0, 0, 0, 0, 0, 0, // 0
//         0, 0, 0, 0, 0, 0, 0, // 1
//         0, 0, 0, 0, 0, 0, 0, // 2
//         0, 0, 0, 0, 0, 0, 0, // 3
//         0, 0, 0, 0, 2, 2, 2, // 4
//         0, 0, 0, 0, 1, 1, 1  // 5
//     ];

//     let board2 = [
//         0, 0, 0, 0, 0, 0, 0, // 0
//         0, 0, 0, 0, 0, 0, 0, // 1
//         0, 0, 0, 0, 0, 0, 0, // 2
//         0, 0, 0, 0, 0, 0, 1, // 3
//         0, 0, 0, 0, 2, 0, 1, // 4
//         0, 0, 0, 1, 1, 0, 1  // 5
//     ];

//     let board3 = [
//         0, 0, 0, 0, 0, 0, 0, // 0
//         0, 0, 0, 0, 0, 0, 0, // 1
//         0, 0, 0, 0, 0, 0, 2, // 2
//         0, 0, 0, 0, 0, 2, 1, // 3
//         0, 0, 0, 0, 2, 1, 2, // 4
//         1, 0, 1, 0, 1, 1, 1  // 5
//     ];

//     boards.push(board1);
//     boards.push(board2);
//     boards.push(board3);

//     return boards;
// }

// // function to pretty print the board
// function printBoard(board) {
//     let board2D = [];
//     for (let i = 0; i < ROWS; i++) {
//         board2D[i] = [];
//         for (let j = 0; j < COLS; j++) {
//             board2D[i][j] = board[i * COLS + j];
//         }
//     }

//     board =board2D;
//     for (let row = 0; row < ROWS; row++) {
//         let line = "";
//         for (let col = 0; col < COLS; col++) {
//             line += board[row][col] + " ";
//         }
//         console.log(line);
//     }
//     console.log();
// }


// // tests
// let boards = generateBoard();
// for (let board of boards) {
//     printBoard(board);
//     console.log(getBestMove(board,3,2));
// }
// // console.log(makeMove(board2));


module.exports = {
    getBestMove,
}