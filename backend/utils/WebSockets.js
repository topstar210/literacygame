let users = [];
let _this = null;

class WebSockets {
    constructor() {
        _this = this;
    }

    connection(client) {
        let  currentRoomId;

        // event fired when the game room is disconnected
        client.on("disconnect", () => {
            users = users.filter((user) => user.socketId !== client.id);
            global.io.to(currentRoomId).emit('curr_users', { users });
        });

        // add identity of user mapped to the socket id
        client.on("identity", (room, username) => {
            users = users.filter((user) => user.socketId !== client.id);
            users.push({
                socketId: client.id,
                // userId: client.id,
                username,
                roomId: room
            });
            client.join(room);
            currentRoomId = room;

            const roomUsers = users.filter((user) => user.roomId === room);
            console.log(username, " joined the game")
            global.io.to(room).emit('curr_users', { users: roomUsers });
        });

        // subscribe person to game & other user as well
        client.on("joinGame", (room, otherUserId = "") => {
            client.join(room);
            currentRoomId = room;
            const roomUsers = users.filter((user) => user.roomId === room);
            global.io.to(room).emit('curr_users', { users: roomUsers });
        });

        client.on('identity_admin', (gamepine)=>{
            client.join(gamepine);
            currentRoomId = gamepine;
        })

        // mute a game room
        client.on("unsubscribe", (room) => {
            client.leave(room);
        });

        /**
         * start game
         * @param {Object} data(
            gamename: String,
            gamepine: String,
            questions: Object,
            settings: Object,
            currRule: String,
            currQuestion: Number 
         * )
         */
        client.on("start_game", (data) => {
            console.log('start_game  -------------- <<<< ');
            const roomUsers = users.filter((user) => user.roomId === data.gamepine);
            global.io.to(data.gamepine).emit('start_game', {...data, users: roomUsers});
        })

        /**
         * get answer list
         * @param {Object} data{
                gamepine: String,
         * }
         */
        client.on("get_answers", async (gamepine, username) => {
            console.log('get_answers', gamepine)
            client.join(gamepine);
            global.io.to(gamepine).emit('get_answers', username);
        })

        /**
         * got to leaderboard
         */
        client.on("goto_leaderboard",(gamepine)=>{
            console.log('goto_leaderboard', gamepine)
            client.join(gamepine);
            global.io.to(gamepine).emit('goto_leaderboard');
        })

        client.on("goto_next_question", (gamepine)=> {
            console.log('goto_next_question', gamepine)
            client.join(gamepine);
            global.io.to(gamepine).emit('goto_next_question');
        });

        client.on("goto_finals_vote", (gamepine)=> {
            console.log('goto_finals_vote', gamepine)
            client.join(gamepine);
            global.io.to(gamepine).emit('goto_finals_vote');
        });

        client.on("start_vote", (gamepine)=>{
            console.log('start_vote', gamepine)
            global.io.to(gamepine).emit('start_vote');
        })

        client.on("rewrite_answer_request", (data)=>{
            console.log('rewrite_answer_request   ====> answer id=', data.answerId)
            global.io.to(data.gamepine).emit('rewrite_answer_request', data);
        })
    }
}

export default new WebSockets();