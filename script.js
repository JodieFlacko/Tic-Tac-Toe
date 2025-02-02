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

gameboard = {
    rows: 3,
    columns: 3,
    board: [],
};

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
            return {playerOne, playerTwo}
    }
    
    const startGame = function(){
        //private variable
        const players = getPlayers();
        const showPlayers = (function(){
        console.log(`First player\n Name: ${players.playerOne.name} - Marker: ${players.playerOne.marker} - Score: ${players.playerOne.score}\nSecond player\n Name: ${players.playerTwo.name} - Marker: ${players.playerTwo.marker} - Score: ${players.playerTwo.score}\n`);
        })(players);

    }
    

    return { startGame }
})();

