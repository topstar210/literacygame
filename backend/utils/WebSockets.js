let users = [];
let _this = null;

class WebSockets {
    constructor() {
        this.users = [];
        _this = this;
    }

    connection(client) {
        // event fired when the game room is disconnected
        client.on("disconnect", () => {
            users = users.filter((user) => user.socketId !== client.id);
        });
        // add identity of user mapped to the socket id
        client.on("identity", (room, username) => {
            users = users.filter((user) => user.socketId !== client.id);
            users.push({
                socketId: client.id,
                userId: client.id,
                username
            });
            client.join(room);
            
            global.io.sockets.emit('curr_users', { users });
            // global.io.sockets.in(room).emit('curr_users', { users });
        });
        // subscribe person to game & other user as well
        client.on("joinGame", (room, otherUserId = "") => {
            client.join(room);
            global.io.sockets.emit('curr_users', { users });
        });
        // mute a game room
        client.on("unsubscribe", (room) => {
            client.leave(room);
        });
    }
}

export default new WebSockets();