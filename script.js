const TicTacToe = (function(){
    const gameController = (function(){
                //private variables
                const rules =  `Tic-tac-toe is a simple game played on a 3x3 grid. It's simple to setup and play which has made it one of the most popular games in the world. Here's how to play:
    
                Objective:
                Be the first player to get three of your marks (either X or O) in a row (horizontally, vertically, or diagonally).
                
                How to Play:
                Players: Two players take turns.
                
                Marking the Grid: Players alternate marking empty spaces in the grid with their assigned mark (X or O).
                
                Winning: The first player to get three of their marks in a row (horizontally, vertically, or diagonally) wins the game.
                
                Tie: If all nine spaces are filled and no player has three in a row, the game ends in a tie.
                `;      
                let gameboard = [];

        function createPlayer(option){
            // if prompting second player
            let score = 0;
            const name = prompt(`Enter ${option.toLowerCase()} player name: `);
            if(option === "First"){
                    while(true){
                    mark = prompt('Enter a mark. Choose between "X" and "O": ');
                    if(mark === "X" || mark === "O") break;
                }
            }
            else mark = mark === "X" ? "O" : "X";
            return {name, mark, score, index: option}
        };
    
        function getPlayers(){
            console.log("\nChoose your names and marks!")
            playerOne = createPlayer("First");
            playerTwo = createPlayer("Second");
            return { playerOne, playerTwo }
        }
    
        function getPosition(player, message = ""){
            console.log(`\n${message}${player.name}'s Turn:\n`)
            let keepGoing = true;
            const pattern = /[1-3]/;
            let col, row;
            while(keepGoing){
                row = +prompt(`Enter the ROW where you want to put the mark: `);
                console.log(`You chose row number: ${row}`);
                col = +prompt(`Enter the COLUMN where you want to put the mark: `);
                console.log(`You chose col number: ${col}`);
                if(pattern.test(row) && pattern.test(col)) keepGoing = false;
                else {
                    alert("OOPS! It seems a problem occured, have a look at the console for details.")
                    console.log("\nEntered values must be numbers between 1 and 3 (included)");
                }
            }
            let position = (row - 1) * 3 + col - 1;
            return position;
        }
    
        function checkWinner(mark){
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
                    if(gameboard[index] !== mark) {
                        winnerFound = false;
                        return;
                    }
                });
                if(winnerFound) return true;
            }
        }
    
        function checkTie(){
            //we have a 3x3 grid, so 9 positions in total
            let i = 0;
            while(i < 9){
                if(!gameboard[i]) return;
                i++;
            }
            console.log("\nIt's a tie. Nobody wins!");
            alert("Looks like we have two masterminds here!");
            return true;
        }
    
        function updateScore(winner){
            winner.score++;
            console.log(`\nWinner is: ${winner.name}`);
            alert("We have a winner!");
        }
    
        function printBoard(){
            //workaround the default newtrailing behavior of console.log
            //added numbers to each position are the column offset
            console.log("\n\t\t1   2   3 \n")   
            for(let row = rowOffset = 0; row < 3; row++, rowOffset += 2){
                console.log(`\t${row + 1}\t${gameboard[row + rowOffset] || " "} | ${gameboard[row + rowOffset + 1] || " "} | ${gameboard[row + rowOffset + 2] || " "} \n`);
            }
            console.log("\n");
        }
    
        function printPlayers(){
            for(const player in players){
                console.log(`\n${players[player].index} player:\n Name: ${players[player].name}\tMark: ${players[player].mark}\n\tScore: ${players[player].score}`);
            }
        }
    
        function printScore(players){
            console.log(`\nSCORE:\n${players.playerOne.name}: ${players.playerOne.score}\n${players.playerTwo.name}: ${players.playerTwo.score}`);
        };

        function printRules(){
            console.log(rules);            
        };
    
        function clearBoard(){
            gameboard = [];
        };
    
        function playRound(players){
            alert("It's time to play! Look at the console to see who's turn is! Let's begin!");
            printBoard(); 
            while(true){
                for(let player in players){
                    const currentPlayer = players[player];
                    let position = getPosition(currentPlayer);
                    while(gameboard[position]) {
                        alert("OOPS! It seems a problem occured, have a look at the console for details.")
                        position = getPosition(currentPlayer, "\nThat position has already been taken. Enter valid position\n");
                    }
                    gameboard[position] = currentPlayer.mark;
                    printBoard();
                    if(checkTie()) {
                        clearBoard();
                        printScore(players);
                        return;
                    }
                    if(checkWinner(currentPlayer.mark)){
                        updateScore(currentPlayer);
                        printScore(players);
                        clearBoard();
                        return;
                    }
                }
            }
        };
    
        (function greet(){
            alert("Hello!\nWelcome to TicTacToe by crlyflacko!");
            alert("Open the console to start playing.");
            console.log(`Hello fratm!\nType "TicTacToe.start()" in the console to start a new game!\n\n(It is case sensitive!)\n`); 
            console.log('Type TicTacToe.rules() to have a look at the rules.');
        })();

        return { getPlayers, printBoard, printPlayers, printScore, playRound, printRules}
    })();

    const start = function (){
        //greeting
        alert("Time to start!");
        players = gameController.getPlayers();
        gameController.printPlayers(players);
        //first round
        gameController.playRound(players);
        
        while(confirm("Do you want to play another round?")){
            gameController.playRound(players);
        }

        if(confirm("Looks like somebody is a poor looser... Do you want to start from scratch?")) start();
        else {
            alert("Thank you for playing! Can't wai to see you two play again!")
            console.log("Bye Bye fratm!");
        };
    }
    return { start, rules: gameController.printRules };
})();




