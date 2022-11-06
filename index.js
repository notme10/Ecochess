var express = require("express"); // The express module is used to look at the address of the request and send it to the correct function 
var bodyParser = require("body-parser");
var http = require("http"); // The http module is used to listen for requests from a web browser
var path = require("path"); // The path module is used to transform relative paths to absolute paths
var Io = require("socket.io");

var app = express(); // creates an express application

var server = http.createServer(app); // Creates the web server

var io = Io(server);
var axios = require("axios").default;

var port = process.env.PORT ? parseInt(process.env.PORT) : 8080; // Defines what port to use to listen to web requests

/**
 * @desc emit everything when there is a connection
 * @return a bunch of emits
 */
function addSockets() {
    var rooms = {}; // stores all the rooms

    /**
     * @desc listens for connection from client, initializes everything
     */
    io.on('connection', (socket) => {

        var name; // server-side variables for specific connections
        var roomId; // the actual roomId that that a player gets 

        
        /**
         * @desc sets roomId to room of the connected user
         */
        socket.on('setRoom', (data) => {
            roomId = data.room;
            if (!rooms[roomId]) {
                rooms[roomId] = { w: null, b: null, config: null, history: null };
            }
        })

        /**
         * @desc sets name to name of the connected user
         */
        socket.on('playerName', (data) => {
            name = data.name;

            if (rooms[roomId]["w"] == null) {
                rooms[roomId]["w"] = name;
            } else if (rooms[roomId]["b"] == null) {
                rooms[roomId]["b"] = name;
            }

            io.emit('sidesInfo', rooms[roomId]);
            io.emit('playerConnect', {
                name: name,
                info: rooms[roomId]
            });
        })

        socket.on('getRooms', (data) => {
            let roomsList = [];

            for(room in rooms) {
                if(rooms[room].w) {

                    let playerCount_send = 0;
                    let status_send = '';
                    if(rooms[room].b) {
                        playerCount_send = 2;
                        status_send = "In Progress";
                    } else {
                        playerCount_send = 1;
                        status_send = "Waiting";
                    }

                    roomsList.push({
                        w: rooms[room].w,
                        b: rooms[room].b,
                        roomCode: room,
                        playerCount: playerCount_send,
                        status: status_send
                    });
                }
            }

            io.emit('updateRooms', roomsList);
        })

        /**
         * @desc emits sendMove
         */
        socket.on('makeMove', (data) => {
            io.emit("sendMove", (data));
        });

        /**
         * @desc emits playerDisconnect
         */
        socket.on('disconnect', (data) => {

            if (rooms[roomId]) {
                if (rooms[roomId]["w"] == name) {
                    io.emit('playerDisconnect', "w");
                } else if (rooms[roomId]["b"] == name) {
                    io.emit('playerDisconnect', "b");
                }
            }

            if (rooms[roomId] == null || rooms[roomId]["w"] == null && rooms[roomId]["b"] == null) {
                rooms[roomId] = null;
            }
            else {
                rooms[roomId]["w"] = null;
                rooms[roomId]["b"] = null;
            }
            io.emit('sidesInfo', rooms[roomId]) // server sends the side info
        });
    });

}

/**
 * @desc starts server, initializes all sockets
 */
function startServer() {
    addSockets();

    app.use(bodyParser.json({ limit: "16mb" }));
    app.use(express.static(path.join(__dirname, "public")));

    app.get("/", (req, res, next) => {
        var filePath = path.join(__dirname, "./home.html");
        res.sendFile(filePath); 
    });

    app.get("/game", (req, res, next) => {
        var filePath = path.join(__dirname, "./game.html");
        res.sendFile(filePath);
    });

    app.post("/game", (req, res, next) => {
        console.log(req.body);
        res.send("OK");
    });

    /**
     * @desc Defines what function to all when the server recieves any request from http://localhost:8080
     */
    server.on("listening", () => {
        var addr = server.address(),
            bind =
                typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
        console.log("Listening on " + bind);
    });
    server.listen(port);
}

startServer();
