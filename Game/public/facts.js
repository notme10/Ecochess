var factsList = {
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
        "More than 70% of the earth's surface is part of the ocean.",
        "The majority of life present on earth is aquatic.",
        "The ocean has absorbed more than 90% of the warming created from the result of global warming. ",
        "The rise of temperatures in oceans leads to coral bleaching and the loss of breeding grounds for other marine animals.",
        "Plastic is the most common pollutant found in oceans and is also the most deadly as it is not easily broken down and animals mistake it as food.",
        "There is a garbage patch in the pacific ocean now two times larger than Texas. Less than five percent of the Earth's oceans have been explored by humans.",
        "Water at the bottom of the ocean can be incredibly hot. ",
        "To this day, sewage water is being released into the ocean.",
        "As a result of global warming, the sea levels rise, causing problems for humans and animals alike. ",
        "The world's largest mountain chain is located in the ocean.",
        "The Challenger Deep is the lowest known point in the ocean, and is deeper than Mount Everest is tall. ",
        "There are more historic artifacts under the sea than in museums.",
        "Contrary to popular belief, the ocean actually creates more oxygen than trees.",
        "Around 50 percent of the US exists underwater.",
        "Coral creates its own “sunscreen” by producing coral fluoresce that protects the algae found in coral.",
        "The largest mountain range is found underwater and is called the Mid-Oceanic Ridge that is around 40,390 miles long.",
        "The loudest sound ever recorded was made by an iceberg. In 1997, the sound was recorded and named, “The Bloop.” It was said to be heard from more than 3,000 miles away.",
        "Ice found in the ocean is safe enough to drink. You first must let the fresh ice sit to let the brine release. After that, the ice is safe to consume.",
        "Ninety percent of the earth's volcanic activity happens in the ocean.",
        "It is estimated there are more than 3 million shipwrecks on the ocean floor.",
        "There are more historic artifacts under the sea than in all of the world's museums.",
        "The great barrier reef in Australia can be seen from the moon.",
        "There are more than 400 species of sharks in the ocean.",
        "Only five percent of the ocean's floor has been mapped in detail.",
        "One percent of the ocean is covered in coral reefs.",
        "The largest blue whale on record was 108 feet long. That's as tall as an 11-story building.",
        "Fourteen percent of the earth's protein comes from the ocean.",
        "We still only know a fraction of the marine species in our oceans.",
        "It's possible to find rivers and lakes beneath the ocean.",
        "Around 50 per cent of the US lies beneath the ocean.",
        "The Pacific Ocean is the world's largest ocean and contains around 25,000 islands.",
        "The loudest ocean sound came from an icequake.",
        "The ocean's canyons make the Grand Canyon seem small.",
        "The biggest ocean waves are beneath its surface.",
        "The ocean is home to nearly 95% of all life.",
        "There's enough gold in the ocean for each of us to have nine pounds of it!",
        "There's an ice sheet larger than the continental United States.",
        "The planet's longest mountain range is underwater and is 10 times longer than the Andes.",
        "One iceberg could supply a million people with drinking water for five years.",
        "Pressure at the bottom of the ocean would crush you like an ant.",
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
        "Increased consumption of beef contributes to the rise of deforestation.",
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
        "Air is mostly gas. Air is all around us, but we can't see it.",
        "Air contains water, in the form of tiny droplets. ",
        "Although plants produce air, they also need it to grow.",
        "Air pollution is a mixture of solid particles and gases in the air.",
        "Breathing in bad air pollution can cause risks of heart disease and strokes.",
        "Air pollution is the fourth largest threat to human health.",
    ],
};

var infoBox = document.getElementById("infoBox"); // initializes infoBox
var chosenRegion = `${localStorage.getItem("chosenRegion")}`; // gets the chosen region of the player

infoBox.className = `black${localStorage.getItem("chosenRegion")}`;
environmentFacts.innerText =
    factsList[chosenRegion][
        Math.floor(Math.random() * factsList[chosenRegion].length)
    ];

// sets the interval of how fast the facts show
var factsInterval = setInterval(function () {
    environmentFacts.innerText =
        factsList[chosenRegion][
            Math.floor(Math.random() * factsList[chosenRegion].length)
        ];
}, 8000);
