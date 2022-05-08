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

function addSockets() { /* initialize everything when there is a connection*/

    var rooms = {}; // something to store all the rooms??


    io.on('connection', (socket) => { // server listens for a connection from a client

        var name; // server-side variables for specific connections
        var roomId; // the actual roomId that that a player gets 
        socket.on('setRoom', (data) => { //sets te room id to the the room of the connected user
            roomId = data.room;
            if (!rooms[roomId]) {
                rooms[roomId] = { w: null, b: null, config: null, history: null };
            }
        })
        socket.on('playerName', (data) => { // sets name to the connected player's name
            name = data.name;

            if (rooms[roomId]["w"] == null) {
                rooms[roomId]["w"] = name;
            } else if (rooms[roomId]["b"] == null) {
                rooms[roomId]["b"] = name;
            }

            console.log(rooms, roomId, rooms[roomId])
            io.emit('sidesInfo', rooms[roomId]) // sends the rooms through sidesInfo
            io.emit('playerConnect', {
                name: name,
                info: rooms[roomId]
            }); // emits a message
        })

        socket.on('makeMove', (data) => { // server listens for a move 
            // rooms[roomId]["pieces"] = data.pieces;
            // rooms[roomId]["turn"] = data.turn;
            // var movesListArray = rooms[roomId]["moveList"];
            // var lastPiece = movesListArray[movesListArray.length - 1];
            // if(!lastPiece || lastPiece.pieceName !== data.moves.pieceName) {
            // 	rooms[roomId]["moveList"].push(data.moves);
            // }

            io.emit("sendMove", (data)); // sends move
        });

        socket.on('disconnect', (data) => { // server listens for a disconnection

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
                // if (rooms[roomId]["w"] == name) {
                rooms[roomId]["w"] = null;
                // }
                // if (rooms[roomId]["b"] == name) {
                rooms[roomId]["b"] = null;
                // }
            }
            io.emit('sidesInfo', rooms[roomId]) // server sends the side info
        });
    });

}

function startServer() { // probably starts the server
    addSockets(); // calls addSockets to initialize everything once the connections happen

    // I have no clue how to decipher this

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

                var curX = response.data.longitude; // gets the longitude of the location for assignment
                var curY = response.data.latitude; // gets the lat

                // curX = 117;
                // curY = 25;

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
                        biome: "Plains",
                    },

                    Winnipeg: {
                        x: -97,
                        y: 50,
                        biome: "Plains",
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
                        biome: "Plains",
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
                        biome: "Mountain",
                    },

                    Santiago: {
                        x: -70,
                        y: -33,
                        biome: "Mountain",
                    },

                    Asuncion: {
                        x: -57,
                        y: -25,
                        biome: "Forest",
                    },

                    Cordoba: {
                        x: -64,
                        y: -31,
                        biome: "Mountain",
                    },

                    Buenos_Aires: {
                        x: -58,
                        y: -34,
                        biome: "Ocean",
                    },

                    Nuuk: {
                        x: -51,
                        y: 64,
                        biome: "Tundra",
                    },

                    Reykjavik: {
                        x: -21,
                        y: 64,
                        biome: "Ocean",
                    },

                    Reykjavik: {
                        x: -21,
                        y: 64,
                        biome: "Ocean",
                    },

                    Dublin: {
                        x: -6,
                        y: 53,
                        biome: "Plains",
                    },

                    Berlin: {
                        x: 13,
                        y: 52,
                        biome: "Forest",
                    },

                    Oslo: {
                        x: 11,
                        y: 60,
                        biome: "Forest",
                    },

                    Helsinki: {
                        x: 25,
                        y: 60,
                        biome: "Forest",
                    },

                    Warsaw: {
                        x: 21,
                        y: 52,
                        biome: "Forest",
                    },

                    Moscow: {
                        x: 38,
                        y: 56,
                        biome: "Tundra",
                    },

                    Harbin: {
                        x: 126,
                        y: 45,
                        biome: "Forest",
                    },

                    Seoul: {
                        x: 127,
                        y: 37,
                        biome: "Mountain",
                    },

                    Tokyo: {
                        x: 140,
                        y: 35,
                        biome: "Ocean",
                    },

                    Beijing: {
                        x: 116,
                        y: 40,
                        biome: "Plains",
                    },

                    Kabul: {
                        x: 69,
                        y: 35,
                        biome: "Desert",
                    },

                    Tehran: {
                        x: 51,
                        y: 36,
                        biome: "Desert",
                    },

                    Amman: {
                        x: 36,
                        y: 32,
                        biome: "Desert",
                    },

                    Athens: {
                        x: 24,
                        y: 38,
                        biome: "Mountain",
                    },

                    Tunis: {
                        x: 10,
                        y: 37,
                        biome: "Desert",
                    },

                    Madrid: {
                        x: -4,
                        y: 40,
                        biome: "Plains",
                    },

                    Riyadh: {
                        x: 47,
                        y: 25,
                        biome: "Desert",
                    },

                    Karachi: {
                        x: 67,
                        y: 25,
                        biome: "Ocean",
                    },

                    New_Delhi: {
                        x: 77,
                        y: 29,
                        biome: "Jungle",
                    },

                    Hyderabad: {
                        x: 78,
                        y: 17,
                        biome: "Plains",
                    },

                    Bangkok: {
                        x: 100,
                        y: 14,
                        biome: "Jungle",
                    },

                    Hong_Kong: {
                        x: 114,
                        y: 22,
                        biome: "Jungle",
                    },

                    Singapore: {
                        x: 104,
                        y: 1,
                        biome: "Jungle",
                    },

                    Brunei: {
                        x: 115,
                        y: 5,
                        biome: "Ocean",
                    },

                    Manila: {
                        x: 121,
                        y: 15,
                        biome: "Jungle",
                    },

                    Jakarta: {
                        x: 107,
                        y: -6,
                        biome: "Jungle",
                    },

                    Perth: {
                        x: 116,
                        y: -32,
                        biome: "Reef",
                    },

                    Sydney: {
                        x: 151,
                        y: -34,
                        biome: "Reef",
                    },

                    Auckland: {
                        x: 175,
                        y: -37,
                        biome: "Ocean",
                    },

                    Lagos: {
                        x: 3,
                        y: 6,
                        biome: "Ocean",
                    },

                    Kinshasa: {
                        x: 15,
                        y: -4,
                        biome: "Jungle",
                    },

                    Addis_Ababa: {
                        x: 39,
                        y: 9,
                        biome: "Plains",
                    },

                    Lusaka: {
                        x: 28,
                        y: -15,
                        biome: "Plains",
                    },

                    Mombasa: {
                        x: 40,
                        y: -4,
                        biome: "Jungle",
                    },

                    Gaborone: {
                        x: 26,
                        y: -25,
                        biome: "Desert",
                    },

                    Cape_Town: {
                        x: 18,
                        y: -34,
                        biome: "Ocean",
                    }
                };

                function distCalc(curX, curY, targetX, targetY) { //calculates distance from an important city
                    return Math.abs(
                        Math.sqrt(
                            (curX - targetX) * (curX - targetX) +
                            (curY - targetY) * (curY - targetY)
                        )
                    );
                }

                var nearestCity; // the nearest city is found and set into here
                var shortestDistance = Number.MAX_SAFE_INTEGER; // shortest possible distance is set here, which is the max number allowed 
                var cityBiome; // biome that will be assigned to the city

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
                // let city = `${response.data.city}, ${response.data.region}`;
                let city = `The nearest city is ${nearestCity}. Its biome is ${cityBiome}.`
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
