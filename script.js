//Gameboard represents the state of the board. Each square holds a cell, defined later
function Gameboard(){
    let board = [];
    const cells = 9;
    const winningCombos = [ 
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ];
    let status;

    //This loop creates a bidimensionale array of cells (later defined by Cell())
    for(let i = 0; i < cells; i++){
        board.push(cell())
    }

    //For later UI use
    const getBoard = () => board;
    const printBoard = () => {
        const boardWithCellMarks = board.map(cell => cell.getValue());
        console.log(boardWithCellMarks);
    }

    const addMark = (index, player) => {
        //if the value is a truthy value (i.e. a mark) the move is invalid
        if(board[index].getValue()) return;

        board[index].updateMark(player);
    }

    const clearBoard = () =>{
        board = [];
        status = ''; 
    }

    const getWinningCombos = () => winningCombos;

    return { getBoard, printBoard, addMark, clearBoard, getWinningCombos };
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
    let gameWon = false;

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }
    
    const getActivePlayer = () => activePlayer; 

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    }

    const checkWin = (index, player) => {
        const winningCombos = board.getWinningCombos();
        let plays = board.getBoard().reduce((total, elem, index) => elem.getValue() === player ? total.concat(index) : total, []);
        console.log(winningCombos)
        for([index, winCombo] of winningCombos.entries()){
            if(winCombo.every(elem => plays.indexOf(elem) > -1)){
                gameWon = { player: player, index: index };
                break;
            }
        }
        return gameWon;
    }

    const getGameStatus = () => gameWon;

    const updateScore = () => {
        activePlayer.score++;
    }

    const playRound = (index) => {

        let gameWon = false;
        activePlayer = getActivePlayer();

        console.log(`${activePlayer.name} mark with ${activePlayer.mark} row: ${index}`);
        board.addMark(index, activePlayer.mark);

        checkWin(index, activePlayer.mark);
        if(gameWon){
            updateScore();
            console.log("fratms")
        }
        switchPlayerTurn();
        printNewRound();
        
    } 

    //initial game message
    printNewRound();

    return { playRound, getActivePlayer, getBoard: board.getBoard, getGameStatus, clearBoard: board.clearBoard, getPlayersData: playersController.getPlayers, setPlayerData: playersController.setData };
}

function screenController(){
    const game = GameController();
    //cache DOM elements
    const DOMelements = (function cacheDOM(){
        const body = document.querySelector("body");
        const container = body.querySelector(".container");
        const dialogsContainer = document.querySelector(".dialogs-container");
        const boardDiv = container.querySelector(".game");
        const dataDiv = container.querySelector(".data");
        const cells = boardDiv.querySelectorAll(".game div");
        const buttonCells = boardDiv.querySelectorAll("button");
        const dialog = dialogsContainer.querySelector(".first-dialog");
        const form = dialog.querySelector(".first-form");
        const confirmButtons = dialogsContainer.querySelectorAll(".confirm button");
        const intro = document.querySelector(".intro")
        return { container, boardDiv, cells, dataDiv, form, confirmButtons, dialog, dialogsContainer, body, intro, buttonCells };
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
        DOMelements.buttonCells.forEach((button, index) => {
                button.dataset.index = index;
                const cell = button.querySelector("div");
                if(!cell.hasAttribute("class")){
                    if(board[index].getValue() === "X") cell.classList.add("x");
                    else if(board[index].getValue() === "O") cell.classList.add("o");
                }
            });
    } 

    //event handler
    function boardClickHandler(event) {
        //get board status
        const status = game.getGameStatus()
        //if someone wins or there is a tie the board is cleared
        if(status){
            DOMelements.cells.forEach(cell => cell.removeAttribute("class"));
            game.clearBoard();
            return;
        }

        //else insert marker
        const selectedCell = event.target.dataset.index;
        
        if(!event.target.dataset.index) return;

        game.playRound(selectedCell);
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

    function bodyHandler(e){
        e.preventDefault();
        DOMelements.intro.style.display = "none";
        DOMelements.dialog.show();
        ["keypress", "click"].forEach(event => DOMelements.body.removeEventListener(event, bodyHandler))
    }

    DOMelements.boardDiv.addEventListener("click", boardClickHandler);
    DOMelements.confirmButtons.forEach(button => button.addEventListener("click", formClickHandler));
    ["keypress", "click"].forEach(event => DOMelements.body.addEventListener(event, bodyHandler))

}

screenController();

