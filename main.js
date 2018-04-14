let board;
let winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 4, 8],
  [2, 4, 6],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8]
]
let User = 'O';
let CPU = 'X';
let cells = document.querySelectorAll(".cell");
let btn1 = document.getElementById("btn1");
let gameButton = document.getElementById("btn2");
let btn3 = document.getElementById("btn3");

function changeChoice() {
  if (User == 'O'){
    User = 'X';
    CPU = 'O'
    btn1.innerText = '"O"';
  } else {
    User= 'O';
    CPU = 'X';
    btn1.innerText = '"X"';
  }
}

function startGame() {
  console.log("Clicked");
  if (gameButton.innerText == "Reset") {
    resetGame();
  } else {
    gameButton.innerText = "Reset";
    btn1.style.display = 'none';
    board = Array.from(Array(9).keys());
    for (let i = 0;i < cells.length;i++) {
      cells[i].style.cursor = 'pointer';
      cells[i].style.backgroundColor = '';
      cells[i].innerText = '';
      cells[i].addEventListener('click', clickedCell, false);
    }
  }
}

function resetGame() {
  gameButton.innerText = 'Start';
  for (let i = 0;i < cells.length;i++) {
    cells[i].style.cursor = 'auto';
    cells[i].style.backgroundColor = '';
    cells[i].innerText = '';
    cells[i].removeEventListener('click', clickedCell, false);
  }
  btn1.style.display = 'inline';
}

function clickedCell(event) {
  let gameOver;
  let cell = event.target;
  gameOver = placeMove(cell.id, User);
  if (!checkTie()) gameOver = placeMove(bestmove(board, CPU).index, CPU);
  else {
    declareWinner({player: "TIE"});
  }
  if (gameOver != null) {
    declareWinner(gameOver);
  }
}

function checkTie() {
  let emptySlots = findEmptySlots(board);
  if (emptySlots.length == 0) return true;
  else return false;
}

function placeMove(index, player) {
  if (typeof(board[index]) == 'number') {
    board[index] = player;
    let cell = document.getElementById(index);
    cell.innerText = player;
    cell.removeEventListener('click', clickedCell, false);
    // console.log(cell);
    cell.style.cursor = 'auto';
    return checkWin(board, player);
  }
}

function checkWin(board, player) {
  let play = [];
  for (let [i, elem] of board.entries()) {
    if (elem == player) {
      play.push(i);
    }
  }
  let gameOver = null;
  for (let [index, winCombo] of winCombos.entries()) {
    if (winCombo.every((element) => {
      return (play.indexOf(element) > -1)
    })) {
      gameOver = {
        index: index,
        player: player
      };
    }
  }
  return gameOver;
}

function declareWinner(gameOver) {
  if (gameOver.player == "TIE") {
    console.log("Tie");
  } else {
    console.log(gameOver.player);
    for (let index of winCombos[gameOver.index]) {
      cells[index].style.backgroundColor = 'rgb(0, 150, 150)';
      // cells[index].style. = 'bolder';
    }
    let emptySlots = findEmptySlots(board);
    for (let index of emptySlots) {
      let cell = cells[index];
      cell.removeEventListener('click', clickedCell, false);
      cell.style.cursor =  'auto';
    }
  }
  btn1.style.display = 'inline';
  gameButton.innerText = 'Start';
}

function findEmptySlots(board) {
  let emptySlots = []
  for (let [index, elem] of board.entries()) {
    if (typeof(elem) == 'number') {
      emptySlots.push(index);
    }
  }
  return emptySlots;
}

function bestmove(board, player) {
  let emptySlots = findEmptySlots(board);
  if (checkWin(board, User)) {
    return {score: -10};
  } else if (checkWin(board, CPU)) {
    return {score: 10};
  } else if (emptySlots.length == 0){
    return {score: 0};
  }
  let moves = [];
  for (let i = 0;i < emptySlots.length; i++) {
    board[emptySlots[i]] = player;
    let move = {
      index: emptySlots[i]
    }
    if (player == CPU) move.score = bestmove(board, User).score;
    else move.score = bestmove(board, CPU).score;
    moves.push(move);
    board[emptySlots[i]] = emptySlots[i];
  }
  let bestMove;
  if (player == CPU) {
    let maxScore = -11;
    for (let i = 0;i < moves.length;i++) {
      if (moves[i].score > maxScore) {
        maxScore = moves[i].score;
        bestMove = moves[i];
      }
    }
  } else {
    let minScore = 11;
    for (let i = 0;i < moves.length;i++) {
      if (moves[i].score < minScore) {
        minScore = moves[i].score;
        bestMove = moves[i];
      }
    }
  }
  return bestMove
}
