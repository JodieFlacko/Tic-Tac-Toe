//Gameboard represents the state of the board. Each square holds a cell, defined later
function Gameboard(){
    const cells = 9;
    let board = [];
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

    //For later UI use
    const getBoard = () => board;

    const addMark = (index, player) => {
        //if the value is a truthy value (i.e. a mark) the move is invalid
        if(board[index].getValue()) return;

        board[index].updateMark(player);
    }

    const clearBoard = () => {
        board = [];
        for(let i = 0; i < cells; i++){
        board.push(cell())
        }
    };

    const getWinningCombos = () => winningCombos;

    //This loop creates a bidimensionale array of cells (later defined by Cell())
    clearBoard();

    return { getBoard, addMark , getWinningCombos, clearBoard };
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
    let status = {
            value: false,
        };

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
        
    }
    
    const getActivePlayer = () => activePlayer; 

    const checkWin = (index, player) => {
        const winningCombos = board.getWinningCombos();
        let plays = board.getBoard().reduce((total, elem, index) => elem.getValue() === player ? total.concat(index) : total, []);
        for([index, winCombo] of winningCombos.entries()){
            if(winCombo.every(elem => plays.indexOf(elem) > -1)){
                status = { value: "win", index: index };
                break;
            }
        }
        return status;
    };

    const checkTie = () => {
        const emptyCells = board.getBoard().filter(cell => cell.getValue() === "");
        if(emptyCells.length === 0) status.value = "tie";
    }

    const roundOver = () =>{
        board.clearBoard(); 
        status = {
            value: false,
        };
    };

    const getGameStatus = () => status;

    const updateScore = () => {
        activePlayer.score++;
    };

    const playRound = (index) => {
        activePlayer = getActivePlayer();

        board.addMark(index, activePlayer.mark);

        checkTie();
        checkWin(index, activePlayer.mark);
        if(status.value){
            if(status.value=== "win") updateScore();
            switchPlayerTurn();
            return status;
        }
        switchPlayerTurn();
        return status;
    } 

    return { playRound, getActivePlayer, getBoard: board.getBoard, clearBoard: board.clearBoard, getWinningCombos: board.getWinningCombos, getGameStatus, roundOver: board.roundOver, getPlayersData: playersController.getPlayers, setPlayerData: playersController.setData, roundOver, checkTie };
}

function screenController(){
    let game = GameController();
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
        const secondForm = dialogsContainer.querySelector(".second-form")
        const confirmButtons = dialogsContainer.querySelectorAll(".confirm button");
        const intro = document.querySelector(".intro");
        const restartButton = container.querySelector(".restart button"); 
        return { container, boardDiv, cells, dataDiv, form, confirmButtons, dialog, dialogsContainer, body, intro, buttonCells, secondForm, restartButton };
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
            const activePlayerSpan = document.createElement("span");
            scoreSpan.classList.add("score");
            markSpan.classList.add("mark");
            activePlayerSpan.classList.add("active-player");            

            DOMelements.dataDiv.appendChild(playerPar);
            playerPar.appendChild(nameSpan);
            playerPar.appendChild(markSpan);
            playerPar.appendChild(scoreSpan);
            playerPar.appendChild(activePlayerSpan);

            nameSpan.textContent = player.name.toUpperCase() + ":";
            markSpan.classList.add(player.mark.toLowerCase());
            scoreSpan.textContent = player.score;

            //display turn
            const activePlayer = game.getActivePlayer().mark;
            if(player.mark === activePlayer) activePlayerSpan.textContent = "MY TURN";
        });

        //fill the cells
        DOMelements.buttonCells.forEach((button, index) => {
                button.dataset.index = index;
                const cell = button.querySelector("div");
                if(!cell.classList.contains("x") || !cell.classList.contains("o")){
                    if(board[index].getValue() === "X") cell.classList.add("x");
                    else if(board[index].getValue() === "O") cell.classList.add("o");
                }
            });
    } 
    const showWin = (index) =>{
        const winningCombos = game.getWinningCombos();
        winningCombos[index].forEach(element => DOMelements.cells[element].classList.add("update-status"));
    }

    const showTie = () => {
        DOMelements.cells.forEach(cell => cell.classList.add("update-status"));
    }

    //event handler
    function boardClickHandler(event) {
        
        //get board status
        let status = game.getGameStatus();
        //if someone wins or there is a tie the board is cleared
        if(status.value){
            DOMelements.cells.forEach(cell => cell.removeAttribute("class"));
            game.roundOver();
            return;
        }

        //make sure we click on the cell and not in the spaces between
        if(!event.target.dataset.index) return;

        //else insert marker
        const selectedCell = event.target.dataset.index;
        
        
        status = game.playRound(selectedCell);
        if(status.value === "win") showWin(status.index);
        if(status.value === "tie") showTie();
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
        const dialog = event.target.parentElement;
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

    function restart() {
        DOMelements.cells.forEach(cell => cell.removeAttribute("class"));
        DOMelements.dialog.show();
        game = GameController();
    }

    DOMelements.boardDiv.addEventListener("click", boardClickHandler);
    DOMelements.form.addEventListener("submit", formClickHandler);
    DOMelements.secondForm.addEventListener("submit", formClickHandler);
    DOMelements.restartButton.onclick = restart;
    ["keypress", "click"].forEach(event => DOMelements.body.addEventListener(event, bodyHandler));

}

screenController();

