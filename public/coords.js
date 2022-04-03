var curX = 122;
var curY = 40;

// replace this with an object instead of an array {}
// figure out how to iterate through an object
// replace the XY coors with actual longitude and latitude coords
var array = [
    sf = {
        City: "San Fransisco",
        X_coord: "122",
        Y_coord: "38",
        Biome: "Ocean"
    },
    veracruz = {
        City: "Veracruz",
        X_coord: "96",
        Y_coord: "19",
        Biome: "Forest"
    },
    phoenix = {
        City: "Phoenix",
        X_coord: "112",
        Y_coord: "33",
        Biome: "Forest"
    },
    winnipeg = {
        City: "Winnipeg",
        X_coord: "97",
        Y_coord: "50",
        Biome: "Forest"
    },
    miami = {
        City: "Miami",
        X_coord: "80",
        Y_coord: "26",
        Biome: "Forest"
    }
];

// this func name is unnecessarily long
function distanceCalculator(curX, curY, targetX, targetY) {
    return Math.abs(Math.sqrt((curX - targetX) * (curX - targetX) + (curY - targetY) * (curX - targetX)));
}

var nearestCity = "";
var shortestDistance = 100000000000;
// what if the shortest distance is larger than that number? What's the LARGEST number you can get in JS?

for (var i = 0; i < array.length - 1; i++) {
    var targetX = array[i]["X_coord"];
    var targetY = array[i]["Y_coord"];
    var distance = distanceCalculator(curX, curY, targetX, targetY);

    if (distance < shortestDistance) {
        shortestDistance = distance;
        nearestCity = array[i]["City"];
    }
}

console.log(nearestCity);

// get the distance from current location to each important coordinate
// create a variable to store the shortest distance
// after going through every distance, assign the user to that biome


// AFTER you've finished the comments that I made:
// Figure out how to use the coords given by the /ipTest thing in index.js
// and figure out the city that is closest to your coordinates