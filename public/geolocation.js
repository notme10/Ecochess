import citiesObject from "./locations.js";

let lat;
let long;

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
}

function distCalc(x1, y1, x2, y2) {
    return Math.sqrt(
        (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)
    );
}

function showPosition(position) {
    lat = position.coords.latitude;
    long = position.coords.longitude;

    console.log(position);
    console.log("Coordinates: " + lat + ", " + long);

    let nearestCity; // the nearest city is found and set into here
    let shortestDistance = Number.MAX_SAFE_INTEGER; // nearest distance will be assigned here
    let cityBiome; // biome that will be assigned to the city

    for (let cityKey in citiesObject) {
        let targetX = citiesObject[cityKey].x;
        let targetY = citiesObject[cityKey].y;
        let distance = distCalc(lat, long, targetY, targetX);

        if (distance < shortestDistance) {
            shortestDistance = distance;
            nearestCity = cityKey;
            cityBiome = citiesObject[cityKey].biome;
        }
        console.log(cityKey, distance);
    }

    console.log(
        "The nearest city is " +
            nearestCity +
            ". Its biome is " +
            cityBiome +
            "."
    );
}

getLocation();
