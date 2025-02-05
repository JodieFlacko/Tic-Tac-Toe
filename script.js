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
        const winningRow = board[row].filter(column => column.getValue() === player);
        const winningColumn = board.filter(row => row[column] === player);
        let winningDiagonal;
        if((player === board[0][0] && player === board[1][1] && player === board[1][2]) || (player === board[0][2] && player === board[1][1] && player === board[2][0])) winningDiagonal = true;

        if(winningRow.length === 3 || winningColumn.length === 3 || winningDiagonal) return true;
    };

    const hasTie = () =>{
        const emptyCells = board.filter(row => row.filter(cell => cell.getValue() === 0).length !== 0);
        if(!emptyCells.length) return true;
    };

    return { getBoard, printBoard, addMark, hasWinner, hasTie };
}

function cell(){
    let value = 0;

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


        if(board.hasWinner(row,column, activePlayer.mark)){
            console.log(`Winner is ${activePlayer}`);
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

    return { playRound, getActivePlayer };
}

const game = GameController();