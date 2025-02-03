const gameController = (function(){

    const createPlayer = function(option){
        // if prompting second player
        let score = 0;
        const name = prompt(`Enter ${option} player name: `);
        if(option === "first"){
                while(true){
                marker = prompt('Enter a marker. Choose between "X" and "O": ');
                if(marker === "X" || marker === "O") break;
            }
        }
        else marker = marker === "X" ? "O" : "X";
        return {name, marker, score}
    };

    function getPlayers(){
        playerOne = createPlayer("first");
        playerTwo = createPlayer("second");
        return { playerOne, playerTwo }
    }

    function getPosition(player, message = ""){
        alert(`${message}${players[player].name}'s Turn:\n`)
        let keepGoing = true;
        const pattern = /[1-3]/;
        let col, row;
        while(keepGoing){
            row = +prompt(`Enter the ROW where you want to put the marker: `);
            col = +prompt(`Enter the COLUMN where you want to put the marker: `);
            if(pattern.test(row) && pattern.test(col)) keepGoing = false;
            else alert("Entered values must be numbers between 1 and 3 (included)");
        }
        let position = (row - 1) * 3 + col - 1;
        return position;
    }

    function checkWinner(marker){
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
            //absurd proposition
            let winnerFound = true;
            winningLines[line].forEach(index => {
                if(gameboard[index] !== marker) {
                    winnerFound = false;
                    return;
                }
            });
            if(winnerFound) return true;
        }
    }

    function updateScore(winner){
        winner.score++;
        return `Winner is: ${winner.name}`;
    }

    function printBoard(){
        //workaround the default newtrailing behavior of console.log
        //added numbers to each position are the column offset
        for(let row = rowOffset = 0; row < 3; row++, rowOffset += 2){
            console.log(`${gameboard[row + rowOffset] || " "} | ${gameboard[row + rowOffset + 1] || " "} | ${gameboard[row + rowOffset + 2] || " "}\n`);
        }
    }
    
    //private variables
    let players;
    let gameboard = [];


    function startGame(){
        players = getPlayers();
        const showPlayers = (function(){
        console.log(`First player\n Name: ${players.playerOne.name} - Marker: ${players.playerOne.marker} - Score: ${players.playerOne.score}\nSecond player\n Name: ${players.playerTwo.name} - Marker: ${players.playerTwo.marker} - Score: ${players.playerTwo.score}\n`);
        })(players);

        const insertMarker = (function(){
            while(true){
                for(let player in players){
                    let position = getPosition(player);
                    while(gameboard[position]) {
                        position = getPosition(player, "Enter valid position\n");
                    }
                    gameboard[position] = players[player].marker;
                    printBoard();
                    if(checkWinner(players[player].marker)){
                        console.log(updateScore(players[player]));
                        return;
                    }
                }
            }
        })(players, gameboard);
    }

    return { startGame }
})();

