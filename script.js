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

    function getPlayers(){
            playerOne = createPlayer();
            playerTwo = createPlayer(playerOne.marker);
            return { playerOne, playerTwo }
    }
    
    let players;
    gameboard = [];


    function startGame(){
        //private variable
        players = getPlayers();
        const showPlayers = (function(){
        console.log(`First player\n Name: ${players.playerOne.name} - Marker: ${players.playerOne.marker} - Score: ${players.playerOne.score}\nSecond player\n Name: ${players.playerTwo.name} - Marker: ${players.playerTwo.marker} - Score: ${players.playerTwo.score}\n`);
        })(players);

        const insertMarker = (function(){
            //allowing modification passing the reference
            while(true){
                for(let player in players){
                    const position = promptForPosition(player);
                    gameboard[position] = players[player].marker;
                    printBoard();
                    if(checkWinner()){
                        updateScore(players[player]);
                        console.log("Winner is: " + players[player].name);
                        return;
                    }
                }
            }
        })(players, gameboard);

        function checkWinner(signal){
            winningLines = {
                firstRow: [0, 1, 2],
                secondRow: [3, 4, 5],
                thirdRow: [6, 7, 8],
                firstCol: [0, 3, 6],
                secondCol: [1, 4 , 7],
                thirdCol: [2, 5, 8],
                firstDiag: [0, 4, 8],
                secondDiag: [2, 4, 6],
            };
            

            for(line in winningLines){
                let keepGoing = true;
                winningLines[line].forEach(index => {
                    if(gameboard[index] !== "X") {
                        keepGoing = false;
                        return;
                    }  
                });
                if(keepGoing) {
                    return true;
                };
            }
        }

        function promptForPosition(player){
            alert(`${players[player].name}'s Turn:\n`)
            const row = prompt(`Enter the ROW where you want to put the marker: `);
            const col = prompt(`Enter the COLUMN where you want to put the marker: `);
            let position = (+row - 1) * 3 + +col - 1;
            return position;
        }

        function updateScore(winner){
            winner.score++;
        }

        function printBoard(){
            for(let pos = 0, add = 0; pos < 3; pos++, add += 2)
            console.log(`${gameboard[pos + add] || " "} | ${gameboard[pos + 1 + add] || " "} | ${gameboard[pos + 2 + add] || " "}\n`);
        }
    }

    return { startGame }
})();

