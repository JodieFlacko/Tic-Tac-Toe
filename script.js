//Gameboard represents the state of the board. Each square holds a cell, defined later
function Gameboard(){
    let board = [];
    const rows = 3;
    const columns = 3;
    //This loop creates a bidimensionale array of cells (later defined by Cell())
    for(let i = 0; i < rows; i++){
        board[i] = [];
        for(let j = 0; j < columns; j++){
            board[i].push(cell());
        }
    }

    //For later UI use
    const getBoard = () => board;
    const printBoard = () => {
        const boardWithCellMarks = board.map((row) => row.map(cell => cell.getValue()));
        console.log(boardWithCellMarks);
    }

    const addMark = (row, column, player) => {
        //if the value is a truthy value (i.e. a mark) the move is invalid
        if(board[row][column].getValue()) return;

        board[row][column].updateMark(player);
    }

    const hasWinner = (row, column, player) => {
        const rowStreak = board[row].filter(cell => cell.getValue() === player);
        const columnStreak = board.filter(cell => cell[column].getValue() === player);
        let diagonalStreak;
        if((player === board[0][0].getValue() && player === board[1][1].getValue() && player === board[2][2].getValue()) || (player === board[0][2].getValue() && player === board[1][1].getValue() && player === board[2][0].getValue())) diagonalStreak = true;

        if(rowStreak.length === 3 || columnStreak.length === 3 || diagonalStreak) return true;
    };

    const hasTie = () =>{
        const emptyCells = board.filter(row => row.filter(cell => cell.getValue() === "").length !== 0);
        if(!emptyCells.length) return true;
    };

    return { getBoard, printBoard, addMark, hasWinner, hasTie };
}

function cell(){
    let value = "";

    const getValue = () => value;
    const updateMark = (player) => value = player;

    return { getValue, updateMark };
}

function GameController(){
    let players = [
        {
            name: "playerOne",
            mark: "X",
        },
        {
            name: "playerTwo",
            mark: "O",
        },
    ];

    const board = Gameboard();

    let activePlayer = players[0]; 

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }
    
    const getActivePlayer = () => activePlayer;
    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    }

    const playRound = (row, column) => {
        activePlayer = getActivePlayer();
        console.log(`${activePlayer.name} mark with ${activePlayer.mark} row: ${row}, column: ${column}`);
        board.addMark(row,column, activePlayer.mark);


        if(board.hasWinner(row, column, activePlayer.mark)){
            console.log(`Winner is ${activePlayer.name}`);
            return;
        } 
        if(board.hasTie()){
            console.log('Tie');
            return;
        }

        switchPlayerTurn();
        printNewRound();
    } 

    //initial game message
    printNewRound();

    return { playRound, getActivePlayer, getBoard: board.getBoard };
}

function screenController(){
    const game = GameController();

    const DOMelements = (function cacheDOM(){
        boardDiv = document.querySelector(".game");
        turnDiv = document.querySelector(".turn");

        return { boardDiv, turnDiv };
    }());

    function updateSreen(){
        //get board
        const board = game.getBoard();
        const boardRows = boardDiv.querySelectorAll(".row");
        const activePlayer = game.getActivePlayer();


        //fill the cells
        boardRows.forEach((row, index) => {
            const rowIndex = index;
            const boardColumns = row.querySelectorAll(".cell");
            boardColumns.forEach((buttonCell, index) =>{
                const cellMark = buttonCell.querySelector("div");
                buttonCell.dataset.row = rowIndex;
                buttonCell.dataset.column = index;
                if(!cellMark.classList.contains("x") && !cellMark.classList.contains("o")){
                    if(board[rowIndex][index].getValue() === "X") cellMark.classList.add("x");
                    else if(board[rowIndex][index].getValue() === "O") cellMark.classList.add("o");
                }
            })
        });
    } 

    //event handler
    function clickHandler(event) {
        const selectedRow = event.target.dataset.row;
        const selectedColumn = event.target.dataset.column;
        
        if(!event.target.dataset.row && !event.target.dataset.column) return;

        game.playRound(selectedRow, selectedColumn);
        updateSreen();  
    }

    DOMelements.boardDiv.addEventListener("click", clickHandler);
    
    updateSreen();
}

screenController();

