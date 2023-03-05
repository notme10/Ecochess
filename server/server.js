let express = require("express"); // The express module is used to look at the address of the request and send it to the correct function 
let bodyParser = require("body-parser");
let http = require("http"); // The http module is used to listen for requests from a web browser
let path = require("path"); // The path module is used to transform relative paths to absolute paths
let Io = require("socket.io");

let app = express(); // creates an express application
let server = http.createServer(app); // Creates the web server

let io = Io(server);

let port = process.env.PORT ? parseInt(process.env.PORT) : 8080; // Defines what port to use to listen to web requests

const jsChessEngine = require('js-chess-engine')
const game = new jsChessEngine.Game()
game.printToConsole()

app.listen(port, () => {
    console.log("listening on port" + port);
});

app.get("/isCheckmate", async(req, res) => {
    const { board } = req.params

    try {
        res.status(200).send(True);
    } catch(err) {
        console.log(err);
    }
})



