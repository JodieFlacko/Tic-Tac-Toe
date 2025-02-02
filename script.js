/* const gameController = (function(){

    init = (function(){
        this.gameboard = this.createBoard();
    })(),

    createBoard = function(){
        const rows = 3;
        const columns = 3;
        const board = [[], []];

        return {rows, columns, board};
    },

    printBoard = function(){
        let board = this.gameboard.board;
        for(let rows = 0; rows < board.rows; rows++){
            for(let columns = 0; columns < board.columns; columns++){
                board[[rows][columns]] = rows + columns;  
                console.log(board.board[[rows][columns]] + " ");
            }
            console.log("Fratm");
        }
    }

    
})() */

const gameController = (function(){

    const createPlayer = function(marker = undefined){
        // if prompting second player
        let score = 0;
        if(marker !== undefined){
            const name = prompt('Enter second player name: ');
            marker = marker === 'X' ? "O" : "X";
            return {name, marker, score}
        }
        const name = prompt('Enter first player name: ');
        let signal = true;
        while(signal){
            marker = prompt('Enter a marker. Choose between "X" and "O": ')
            if(marker === "X" || marker === "O") signal = false;
        }
        return {name, marker, score}
    };

    const getPlayers = function(){
            playerOne = createPlayer();
            playerTwo = createPlayer(playerOne.marker);
            return { playerOne, playerTwo }
    }
    
    let players;
    gameboard = [];


    const startGame = function(){
        //private variable
        players = getPlayers();
        const showPlayers = (function(){
        console.log(`First player\n Name: ${players.playerOne.name} - Marker: ${players.playerOne.marker} - Score: ${players.playerOne.score}\nSecond player\n Name: ${players.playerTwo.name} - Marker: ${players.playerTwo.marker} - Score: ${players.playerTwo.score}\n`);
        })(players);

        const checkWinner = function(signal){
            if(gameboard[0] === "X" && gameboard[1] === "X" && gameboard[2] === "X") {
                signal.value = false;
                return true;
            }
        }

        const promptForPosition = function(player){
            alert(`${players[player].name}'s Turn:\n`)
            const row = prompt(`Enter the ROW where you want to put the marker: `);
            const column = prompt(`Enter the COLUMN where you want to put the marker: `);
            let position = row * column - 1;
            return position;
        }

        const updateScore = function(winner){
            winner.score++;
        }

        const insertMarker = (function(){
            let signal = {
                value: true,
            }
            while(signal.value){
                for(let player in players){
                    const position = promptForPosition(player);
                    gameboard[position] = players[player].marker;
                    if(checkWinner(signal)){
                        const winner = players[player];
                        updateScore(winner);
                        console.log(players[player])
                        break;
                    }
                }
            }
        })(players, gameboard, checkWinner, promptForPosition, updateScore);
    }

    return { startGame }
})();

