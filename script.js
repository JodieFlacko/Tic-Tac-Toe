//Gameboard represents the state of the board. Each square holds a cell, defined later
function Gameboard(){
    let board = [];
    const rows = 3;
    const columns = 3;
    let status;
    //This loop creates a bidimensionale array of cells (later defined by Cell())
    for(let i = 0; i < rows; i++){
        board[i] = [];
        for(let j = 0; j < columns; j++){
            board[i].push(cell());
        }
    }

    //For later UI use
    const getBoard = () => board;
    const getStatus = () => status;
    const printBoard = () => {
        const boardWithCellMarks = board.map((row) => row.map(cell => cell.getValue()));
        console.log(boardWithCellMarks);
    }

    const addMark = (row, column, player) => {
        //if the value is a truthy value (i.e. a mark) the move is invalid
        if(board[row][column].getValue()) return;

        board[row][column].updateMark(player);
    }

    const updateStatus = (row, column, player) => {
        const rowStreak = board[row].filter(cell => cell.getValue() === player);
        const columnStreak = board.filter(cell => cell[column].getValue() === player);
        const emptyCells = board.filter(row => row.filter(cell => cell.getValue() === "").length !== 0);
        let diagonalStreak;
        if((player === board[0][0].getValue() && player === board[1][1].getValue() && player === board[2][2].getValue()) || (player === board[0][2].getValue() && player === board[1][1].getValue() && player === board[2][0].getValue())) diagonalStreak = true;

        if(rowStreak.length === 3 || columnStreak.length === 3 || diagonalStreak) {
            status = "win";
        }

        else if(!emptyCells.length) {
            status = "tie";
        }
    };

    const clearBoard = () =>{
        for(let i = 0; i < rows; i++){
            board[i] = [];
            for(let j = 0; j < columns; j++){
                board[i].push(cell());
            }
        }
        status = ''; 
    }

    return { getBoard, printBoard, addMark, getStatus, clearBoard, updateStatus};
}

function cell(){
    let value = "";

    const getValue = () => value;
    const updateMark = (player) => value = player;

    return { getValue, updateMark };
}

function Player(){
    let players = [
        {
            name: "",
            score: 0,
            mark: "",
        },
        {
            name: "",
            score: 0,
            mark: "",
        }
    ];

    const getPlayers = () =>  players;
    const setData = (name, mark = players[0].mark) => {
       if(players[0].name === "")
        players[0].name = name;
        else players[1].name = name;
        if(players[0].mark === "") players[0].mark = mark;
        else players[1].mark = mark === "X" ? "O" : "X";
    }

    return { getPlayers, setData };
}

function GameController(){
    const playersController = Player();
    const board = Gameboard();
    const players = playersController.getPlayers();
    let activePlayer = players[0]; 

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }
    
    const getActivePlayer = () => activePlayer; 

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    }

    const updateScore = () => {
        activePlayer.score++;
    }

    const playRound = (row, column) => {

        activePlayer = getActivePlayer();

        console.log(`${activePlayer.name} mark with ${activePlayer.mark} row: ${row}, column: ${column}`);
        board.addMark(row,column, activePlayer.mark);
        board.updateStatus(row, column, activePlayer.mark)
        boardStatus = board.getStatus();
        if(boardStatus === "win") {
            updateScore();
            return;
        }

        switchPlayerTurn();
        printNewRound();
    } 

    //initial game message
    printNewRound();

    return { playRound, getActivePlayer, getBoard: board.getBoard, getBoardStatus: board.getStatus, clearBoard: board.clearBoard, getPlayersData: playersController.getPlayers, setPlayerData: playersController.setData };
}

function screenController(){
    const game = GameController();
    //cache DOM elements
    const DOMelements = (function cacheDOM(){
        const container = document.querySelector(".container");
        const dialogsContainer = document.querySelector(".dialogs-container");
        const boardDiv = container.querySelector(".game");
        const dataDiv = container.querySelector(".data");
        const boardRows = boardDiv.querySelectorAll(".row");
        const cells = boardDiv.querySelectorAll(".row div");
        const dialog = dialogsContainer.querySelector(".first-dialog");
        const secondDialog = dialogsContainer.querySelector(".second-dialog");
        const form = dialog.querySelector(".first-form");
        const secondForm = secondDialog.querySelector(".second-form");
        const confirmButtons = dialogsContainer.querySelectorAll(".confirm button");
        return { container, boardDiv, boardRows, cells, dataDiv, form, secondForm, confirmButtons, dialog, secondDialog, dialogsContainer };
    }());

    function updateSreen(){  
        //show game
        DOMelements.container.removeAttribute("hidden");

        //get board and players data
        const board = game.getBoard();
        const players = game.getPlayersData();
        DOMelements.dataDiv.textContent = "";
        //displaying data
        players.forEach(player => {
            const playerPar = document.createElement("p");
            playerPar.classList.add("player");
            const nameSpan = document.createElement("span");
            const markSpan = document.createElement("span");
            const scoreSpan = document.createElement("span");
            scoreSpan.classList.add("score");
            markSpan.classList.add("mark");

            DOMelements.dataDiv.appendChild(playerPar);
            playerPar.appendChild(nameSpan);
            playerPar.appendChild(markSpan);
            playerPar.appendChild(scoreSpan);

            nameSpan.textContent = player.name.toUpperCase() + ":";
            markSpan.classList.add(player.mark.toLowerCase());
            scoreSpan.textContent = player.score;
        });

        //fill the cells
        DOMelements.boardRows.forEach((row, index) => {
            const rowIndex = index;
            const boardColumns = row.querySelectorAll(".cell");
            boardColumns.forEach((buttonCell, index) =>{
                const cellMark = buttonCell.querySelector("div");
                buttonCell.dataset.row = rowIndex;
                buttonCell.dataset.column = index;
                if(!cellMark.hasAttribute("class")){
                    if(board[rowIndex][index].getValue() === "X") cellMark.classList.add("x");
                    else if(board[rowIndex][index].getValue() === "O") cellMark.classList.add("o");
                }
            })
        });
    } 

    //event handler
    function boardClickHandler(event) {
        //get board status
        const boardStatus = game.getBoardStatus();
        //if someone wins or there is a tie the board is cleared
        if(boardStatus === "win" || boardStatus === "tie"){
            DOMelements.cells.forEach(cell => cell.removeAttribute("class"));
            game.clearBoard();
            return;
        }

        //else insert marker
        const selectedRow = event.target.dataset.row;
        const selectedColumn = event.target.dataset.column;
        
        if(!event.target.dataset.row && !event.target.dataset.column) return;

        game.playRound(selectedRow, selectedColumn);
        updateSreen();  
    }

    function getDialogData(dialog){
        const form = dialog.querySelector("form");
        const name = form.name.value;
        let mark;
        if(form.mark) mark = form.mark.value;
        return{name, mark}
    }

    function formClickHandler(event) {
        event.preventDefault();
        const dialog = event.target.parentElement.parentElement.parentElement;
        const {name, mark} = getDialogData(dialog);
        game.setPlayerData(name, mark);
        dialog.close();
        if(event.target.dataset.last) {
            DOMelements.container.removeAttribute("hidden");
            updateSreen();
            return;
        }
        const nextDialog = dialog.parentElement.querySelector(`dialog:nth-child(2)`);
        nextDialog.show();
    }

    DOMelements.boardDiv.addEventListener("click", boardClickHandler);
    DOMelements.confirmButtons.forEach(button => button.addEventListener("click", formClickHandler))
}

screenController();

