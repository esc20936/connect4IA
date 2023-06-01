// Create a connection class to connect to a socket using socket.io
// and export it for use in other files
// =============================================================================

// Require socket.io
var io = require('socket.io-client');
const { getBestMove } = require('./AI');


class Connection{

    // Constructor
    constructor(url){
        this.url = url;
        this.socket = io(url);
        console.log('Connection created to ' + this.url);


    }

    // Connect to the socket
    connect(){
        this.socket.on('connect', ()=>{
            
            this.socket.emit("signin",{
                user_name: "Pablo Escobar",
                tournament_id: "142857",
                user_role: "player",
            });


        });
    }

    // Disconnect from the socket
    disconnect(){
        this.socket.on('disconnect', ()=>{
            console.log('Disconnected from ' + this.url);
        });
    }


    waitedSignals(){
        // Wait for the ok_signin signal
        this.socket.on('ok_signin', ()=>{
            console.log('Successfully signed in to ' + this.url);
        }
        );

        // Wait for the ready signal
        this.socket.on('ready', (data)=>{
            console.log('Successfully readied up');
            let {game_id,player_turn_id,board} = data;

            // make a move
            this.makeMove(data);

        }
        );
        // Wait for the finish signal
        this.socket.on('finish', (data)=>{
            let {game_id,player_turn_id, winner_turn_id,board} = data;
            // player ready
            this.playerReady(game_id,player_turn_id,winner_turn_id,board);
        }
        );

    }

    // player ready
    playerReady(game_id,player_turn_id,winner_turn_id,board){
        console.log("player ready- game Finished");
        if(player_turn_id == winner_turn_id){
            console.log("I won");

            // PRETTY PRINTING THE BOARD
            let boardString = "";
            for(let i = 0; i < board.length; i++){
                for(let j = 0; j < board[i].length; j++){
                    boardString += board[i][j] + " ";
                }
                boardString += "\n";
            }
            console.log(boardString);

        }else{
            console.log("I lost");
        }
        this.socket.emit('player_ready', {
            tournament_id: "142857",
            player_turn_id: player_turn_id,
            game_id: game_id,
        });
    }

    makeMove(data){
        let {game_id,player_turn_id,board} = data;
        console.log("make move called");

        let move = getBestMove(board,3,player_turn_id);
        console.log("move: " + move);
        this.socket.emit('play',{
            tournament_id: "142857",
            player_turn_id: player_turn_id,
            game_id: game_id,
            movement: move,
        })
    }

    // get the socket
    getSocket(){
        return this.socket;
    }

}


module.exports = {
    Connection
}

// =============================================================================


