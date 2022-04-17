// MaYBE TRY RESTARTING THE SERVERY :)

/* The express module is used to look at the address of the request and send it to the correct function */
var express = require("express");
var bodyParser = require("body-parser");
var http = require("http"); /* The http module is used to listen for requests from a web browser */
var path = require("path"); /* The path module is used to transform relative paths to absolute paths */
// var mongoose = require('mongoose');
var Io = require("socket.io");
// var dbAddress = process.env.MONGODB_URI || 'mongodb://127.0.0.1/spacecrash';

/* Creates an express application */
var app = express();

/* Creates the web server */
var server = http.createServer(app);

var io = Io(server);
var axios = require("axios").default;

/* Defines what port to use to listen to web requests */
var port = process.env.PORT ? parseInt(process.env.PORT) : 8080;

function addSockets() {
    var rooms = {};

    io.on("connection", (socket) => {
        // server listens for a connection from a client

        var name; // server-side variables for specific connections
        var roomId;
        socket.on("setRoom", (data) => {
            roomId = data.room;
            if (!rooms[roomId]) {
                rooms[roomId] = {
                    w: null,
                    b: null,
                    pieces: null,
                    turn: 0,
                    moveList: [],
                };
            }
        });
        socket.on("playerName", (data) => {
            name = data.name;

            if (rooms[roomId]["w"] == null) {
                rooms[roomId]["w"] = name;
            } else if (rooms[roomId]["b"] == null) {
                rooms[roomId]["b"] = name;
            }

            io.emit("sidesInfo", rooms[roomId]);
            io.emit("playerConnect", {
                name: name,
                info: rooms[roomId],
            }); // emits a message
        });

        socket.on("makeMove", (data) => {
            rooms[roomId]["pieces"] = data.pieces;
            rooms[roomId]["turn"] = data.turn;
            var movesListArray = rooms[roomId]["moveList"];
            var lastPiece = movesListArray[movesListArray.length - 1];
            if (!lastPiece || lastPiece.pieceName !== data.moves.pieceName) {
                rooms[roomId]["moveList"].push(data.moves);
            }
            io.emit("sendMove", data);
        });

        socket.on("disconnect", (data) => {
            // server listens for a disconnection

            // Do something

            if (rooms[roomId]) {
                if (rooms[roomId]["w"] == name) {
                    io.emit("playerDisconnect", "w");
                } else if (rooms[roomId]["b"] == name) {
                    io.emit("playerDisconnect", "b");
                }
            }

            if (
                rooms[roomId] == null ||
                (rooms[roomId]["w"] == null && rooms[roomId]["b"] == null)
            ) {
                rooms[roomId] = null;
            } else {
                // if (rooms[roomId]["w"] == name) {
                rooms[roomId]["w"] = null;
                // }
                // if (rooms[roomId]["b"] == name) {
                rooms[roomId]["b"] = null;
                // }
            }
            io.emit("sidesInfo", rooms[roomId]);
        });
    });
}

function startServer() {
    addSockets();

    app.use(bodyParser.json({ limit: "16mb" }));
    app.use(express.static(path.join(__dirname, "public")));

    app.get("/", (req, res, next) => {
        var filePath = path.join(__dirname, "./game.html");
        res.sendFile(filePath);
    });

    app.post("/", (req, res, next) => {
        console.log(req.body);
        res.send("OK");
    });
    app.get("/ipTest", (req, res, next) => {
        var options = {
            method: "GET",
            url: "https://ip-geolocation-ipwhois-io.p.rapidapi.com/json/",
            headers: {
                "x-rapidapi-host": "ip-geolocation-ipwhois-io.p.rapidapi.com",
                "x-rapidapi-key":
                    "72e9555b18msh88c262cebd13cc6p1082bejsnb6b410214595",
            },
        };

        axios
            .request(options)
            .then(function (response) {

                var curX = response.data.longitude;
                var curY = response.data.latitude;

                let citiesObject = {

                    // City_Name: {
                    //     x: XCOORD,
                    //     y: YCOORD,
                    //     biome: "BIOME",
                    // },


                    Anchorage: {
                        x: -150,
                        y: 61,
                        biome: "Tundra",
                    },

                    Calgary: {
                        x: -114,
                        y: 51,
                        biome: "Tundra",
                    },

                    Winnipeg: {
                        x: -97,
                        y: 50,
                        biome: "Tundra",
                    },

                    Toronto: {
                        x: -80,
                        y: 44,
                        biome: "Tundra",
                    },

                    Montreal: {
                        x: -118,
                        y: 34,
                        biome: "Tundra",
                    },

                    Quebec: {
                        x: -71,
                        y: 46,
                        biome: "Tundra",
                    },
                                        
                    San_Fransisco: {
                        x: -122,
                        y: 37,
                        biome: "Ocean",
                    },
                                        
                    Phoenix: {
                        x: -112,
                        y: 33,
                        biome: "Desert",
                    },
                                        
                    Dallas: {
                        x: -96,
                        y: 32,
                        biome: "Desert",
                    },
                                        
                    Atlanta: {
                        x: -84,
                        y: 33,
                        biome: "Ocean",
                    },
                                        
                    Bermuda_City: {
                        x: -64,
                        y: 32,
                        biome: "Reef",
                    },
                                        
                    Mexico_City: {
                        x: -99,
                        y: 19,
                        biome: "Desert",
                    },
                                        
                    Havana: {
                        x: -82,
                        y: 23,
                        biome: "Reef",
                    },
                                        
                    St_Domingo: {
                        x: -69,
                        y: 18,
                        biome: "Reef",
                    },
                    
                    Caracas: {
                        x: -66,
                        y: 10,
                        biome: "Forest",
                    },
                                        
                    Lima: {
                        x: -77,
                        y: -12,
                        biome: "Forest",
                    },
                                        
                    Santiago: {
                        x: -70,
                        y: -33,
                        biome: "Forest",
                    },
                                        
                    Asuncion: {
                        x: -57,
                        y: -25,
                        biome: "Forest",
                    },
                                        
                    Cordoba: {
                        x: -64,
                        y: -31,
                        biome: "Forest",
                    },

                    Buenos_Aires: {
                        x: -58,
                        y: -34,
                        biome: "Ocean",
                    }
                };

                function distCalc(curX, curY, targetX, targetY) {
                    return Math.abs(
                        Math.sqrt(
                            (curX - targetX) * (curX - targetX) +
                                (curY - targetY) * (curY - targetY)
                        )
                    );
                }

                var nearestCity;
                var shortestDistance = Number.MAX_SAFE_INTEGER;
                var cityBiome;

                for (var cityKey in citiesObject) {
                    var targetX = citiesObject[cityKey].x;
                    var targetY = citiesObject[cityKey].y;
                    var distance = distCalc(curX, curY, targetX, targetY);

                    if (distance < shortestDistance) {
                        shortestDistance = distance;
                        nearestCity = cityKey;
                        cityBiome = citiesObject[cityKey].biome;
                    }
                }

                console.log(
                    "The nearest city is " +
                        nearestCity +
                        ". Its biome is " +
                        cityBiome +
                        "."
                );

                console.log(response.data);
                let city = `${response.data.city}, ${response.data.region}`;
                res.send(city);
            })
            .catch(function (error) {
                console.error(error);
                res.send(error);
            });
        // console.dir(req.ip)
        // res.send(req.ip);
    });

    /* Defines what function to all when the server recieves any request from http://localhost:8080 */
    server.on("listening", () => {
        /* Determining what the server is listening for */
        var addr = server.address(),
            bind =
                typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
        /* Outputs to the console that the webserver is ready to start listenting to requests */
        console.log("Listening on " + bind);
    });

    /* Tells the server to start listening to requests from defined port */
    server.listen(port);
}

// mongoose.connect(dbAddress, startServer);
startServer();
