// info box

var factsList = {
  Standard: [
    "The years 2016 and 2020 hold the tied record for the hottest recorded temperatures on earth.",
    "The oceans have absorbed much of the heat, showing an increase of more than 0.6 degrees Fahrenheit.",
    "Greenland and Antarctica lose a total of 427 billion tons of ice per year.",
    "Glaciers are receding across the world, including in the Alps, Himalayas, Andes, Rockies, Alaska, and Africa.",
    "The global water level rose about eight inches in the last century. Countries like the Maldives and Tuvalu are vulnerable to sea level rise.",
    "The USA has been recording increasing numbers of intense rainfall events. ",
    "The acidity of the ocean has increased by about 30 percent.",
    "Pollution is one of the global killers, comparable with diseases like malaria and HIV.",
    "Ocean based sources such as cargo ships and cruise liners dump 14 billion pounds of garbage into the ocean.",
    "Over one million seabirds and 100,000 sea mammals are killed by pollution each year. ",
    "People living in areas with high levels of air pollutants have a 20 percent higher chance of death from lung cancer than those living in less polluted areas. ",
    "The Mississippi River carries about 1.5 million metric tons of nitrogen pollution into the Gulf of Mexico, creating a “dead zone” in the Gulf each summer about the size of New Jersey.",
    "About 40 percent of lakes in America are too polluted for fishing, aquatic life, or swimming.",
    "Each year, 1.2 trillion gallons of untreated sewage, stormwater, and industrial waste are dumped into US water.",
    "Recycling and composting prevented 85 million tons of material away from being disposed of in 2010."
  ],

  Reef: [
    "Coral needs sunlight to grow, just like plants on land.",
    "Coral Reefs can treat human diseases like arthritis, cancer, and Alzheimer's.",
    "Coral Reefs clean the water by eating the dirty particles. ",
    "The three main types of coral reefs are fringing, barrier, and atoll.",
    "Algae grows inside of Coral Reefs, giving them oxygen.",
    "The most common colors of coral are bright blue, green and red.",
    "A lot of fish eat Coral Reefs.",
    "As a result of pollution, the quality of the water drops. This leaves coral to die since they need clean and clear water in order to survive.",
    "Since coral is not a fast growing plant, it is not feasible for coral reefs to regrow after destruction. As the coral dies, the animals that rely on coral for food also die.",
  ],

  Ocean: [
    "Ocean Facts"
  ],

  Forest: [
    "Forests cover 30 percent of the world's land surface area.",
    "Forests are home for over 80% of the world's animals and plants.",
    "Trees can convert/store 150 kg of carbon dioxide per year.",
    "Trees can help with cooling in urban areas.",
    "Wood fuel provides 40% of the world's global renewable energy supply.",
    "Over 25% of medicines used today are derived from forests.",
    "The world's largest forests are in Russia, Brazil, Canada, China, and the DRC.",
    "The world loses 6.6 million hectares of forest per year.",
    "Illegal logging is a main cause of deforestation and forest loss.",
    "Trees are natural aqueducts, able to redistribute water to where it is needed most.",
    "1.5 acres of forest is cut down every second.",
    "In less than a decade, all the forests in the world will be cut down.",
    "Since 1960, the world has lost half of its forests.",
    "The world already lost half of its rainforest area coverage.",
    "Increased consumption of beef contributes to the rise of deforestation."
  ],

  Tundra: [
    "Arctic tundra is one of the most fragile biomes as it is constantly shrinking as the permafrost melts.",
    "Arctic tundra is permafrost, meaning that the ground is permanently frozen.",
    "The tundra is very important to the earth's temperature regulation.",
    "As global warming gets more severe, the arctic tundra starts to shrink.",
    "Toxic mercury sent into the atmosphere by burning coal threatens human and animal life.",
    "There are two types of tundra biomes: the Arctic tundra and Alpine tundra.",
    "Polar bears come to the tundra during the summer to have their offspring.",
    "Animals in the tundra have special adaptations such as smaller ears and tails so that they lose less heat in the cold.",
    "As the permafrost melts, methane is released into the atmosphere, which feeds into higher global temperatures.",
    "Arctic clouds are more susceptible to air pollution.",
    "Black carbon settles on snow which makes faster melting (ability to reflect sunlight is reduced).",
    "Climate change is decreasing the populations of native tundra species.",
    "The tundra is the coldest of all biomes, usually having a temperature of -36 degrees celsius during the winter and 3 degrees celsius during the summer.",
    "The tundra covers about 20% of all land on Earth.",
    "The tundra is incredibly dry, receiving 10 inches of rain per year (comparable to a desert).",
  ],

  Desert: [
    "The desert biome covers a fifth of the Earth's land.",
    "The four main types of deserts: arid deserts, semi-arid deserts, coastal deserts, and cold deserts. ",
    "The desert receives less then 10 inches of rain each year.",
    "The Sahara Desert is an arid desert.",
    "The desert can become extremely cold at night despite its hot temperature during the day due to their general locations around the equator.",
    "Many animals that live in the desert are nocturnal",
    "Global warming increases the incidents of droughts, which dries up the watering holes.",
    "Higher temperatures can result in wildfires that change the landscapes of the deserts",
  ],

  Sky: [
    "Sky Facts"
  ]
}

var infoBox = document.getElementById("infoBox");
var chosenRegion = `${localStorage.getItem("chosenRegion")}`;

infoBox.className = `black${localStorage.getItem("chosenRegion")}`;
environmentFacts.innerText = factsList[chosenRegion][Math.floor(Math.random()*factsList[chosenRegion].length)];

setInterval(function() {environmentFacts.innerText = factsList[chosenRegion][Math.floor(Math.random()*factsList[chosenRegion].length)]}, 5000);
