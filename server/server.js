let express = require("express"); // The express module is used to look at the address of the request and send it to the correct function 
let bodyParser = require("body-parser");
let http = require("http"); // The http module is used to listen for requests from a web browser
let path = require("path"); // The path module is used to transform relative paths to absolute paths
let Io = require("socket.io");

let app = express(); // creates an express application
let server = http.createServer(app); // Creates the web server

let io = Io(server);

let port = process.env.PORT ? parseInt(process.env.PORT) : 8080; // Defines what port to use to listen to web requests

app.use(express.json());

app.listen(port, () => {
    console.log("listening on port" + port);
});

app.get("/isCheckmate", async(req, res) => {
    const moves = req.body.moves; // function takes in moves as the request

    console.log(req.body.moves);

    if(moves) {
        if(JSON.stringify(moves) === "{}") {
            console.log("checkmate");
            res.status(200).send("True");
        } else {
            res.status(200).send("False");
        }
    } else {
        res.status(500).send("Error!");
    }
});

