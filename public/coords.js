var curX = 96;
var curY = 17;

let citiesObject = {

    "San Fransisco": {
        x: 122,
        y: 38,
        biome: "Ocean"
    }, 
    "Veracruz": {
        x: 96,
        y: 19,
        biome: "Forest"
    }, 
    "Phoenix": {
        x: 112,
        y: 33,
        biome: "Desert"
    },
    "Winnipeg": {
        x: 97,
        y: 50,
        biome: "Tundra"
    },
    "Miami": {
        x: 80,
        y: 26,
        biome: "Reef"
    }

}
if (navigator.geolocation) { //check if geolocation is available
    navigator.geolocation.getCurrentPosition(function (position) {
      console.log(position.latitude);
    });
}

function distCalc(curX, curY, targetX, targetY) {
    return Math.abs(Math.sqrt((curX - targetX) * (curX - targetX) + (curY - targetY) * (curX - targetX)));
}

var nearestCity;
var shortestDistance = Number.MAX_SAFE_INTEGER;
var cityBiome;

for(var city in citiesObject) {
    var targetX = citiesObject[city].x;
    var targetY = citiesObject[city].y;
    var distance = distCalc(curX, curY, targetX, targetY);

    if (distance < shortestDistance) {
        shortestDistance = distance;
        nearestCity = city;
        cityBiome = citiesObject[city].biome;
    }
}

console.log("The nearest city is " + nearestCity + ". Its biome is " + cityBiome + ".");




// DONE replace this with an object instead of an array {}
// DONE figure out how to iterate through an object
// replace the XY coors with actual longitude and latitude coords

// DONE what if the shortest distance is larger than that number? What's the LARGEST number you can get in JS?

// DONE get the distance from current location to each important coordinate
// DONE create a variable to store the shortest distance
// DONE after going through every distance, assign the user to that biome

// AFTER you've finished the comments that I made:
// Figure out how to use the coords given by the /ipTest thing in index.js
// and figure out the city that is closest to your coordinates













// ----------------OLD-CODE---------------------


// var cities = [
//     {
//         City: "San Fransisco",
//         X_coord: "122",
//         Y_coord: "38",
//         Biome: "Ocean"
//     },

//     {
//         City: "Veracruz",
//         X_coord: "96",
//         Y_coord: "19",
//         Biome: "Forest"
//     },

//     {
//         City: "Phoenix",
//         X_coord: "112",
//         Y_coord: "33",
//         Biome: "Desert"
//     },

//     {
//         City: "Winnipeg",
//         X_coord: "97",
//         Y_coord: "50",
//         Biome: "Tundra"
//     },

//     {
//         City: "Miami",
//         X_coord: "80",
//         Y_coord: "26",
//         Biome: "Reef"
//     }
// ];



// for (var i = 0; i < cities.length - 1; i++) {
//     var targetX = cities[i]["X_coord"];
//     var targetY = cities[i]["Y_coord"];
//     var distance = distanceCalculator(curX, curY, targetX, targetY);

//     if (distance < shortestDistance) {
//         shortestDistance = distance;
//         nearestCity = cities[i]["City"];
//     }
// }