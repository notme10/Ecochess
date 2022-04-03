var curX = 122;
var curY = 40;

var cities = [
    {
        City: "San Fransisco",
        X_coord: "122",
        Y_coord: "38",
        Biome: "Ocean"
    },

    {
        City: "Veracruz",
        X_coord: "96",
        Y_coord: "19",
        Biome: "Forest"
    },

    {
        City: "Phoenix",
        X_coord: "112",
        Y_coord: "33",
        Biome: "Desert"
    },

    {
        City: "Winnipeg",
        X_coord: "97",
        Y_coord: "50",
        Biome: "Tundra"
    },
    
    {
        City: "Miami",
        X_coord: "80",
        Y_coord: "26",
        Biome: "Reef"
    }
];

function distanceCalculator(curX, curY, targetX, targetY) {
    return Math.abs(Math.sqrt((curX - targetX) * (curX - targetX) + (curY - targetY) * (curX - targetX)));
}

var nearestCity = "";
var shortestDistance = 100000000000;

for(var i = 0; i<cities.length - 1; i++) {
    var targetX = cities[i]["X_coord"];
    var targetY = cities[i]["Y_coord"];
    var distance = distanceCalculator(curX, curY, targetX, targetY);

    if(distance < shortestDistance) {
        shortestDistance = distance;
        nearestCity = array[i]["City"];
    }
}

console.log(nearestCity);

// get the distance from current location to each important coordinate
// create a variable to store the shortest distance
// after going through every distance, assign the user to that biome
